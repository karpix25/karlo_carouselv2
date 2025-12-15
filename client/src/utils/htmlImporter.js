import { DEFAULT_FONT } from '../constants/fonts';

const uid = () =>
    (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

export function parseHtml(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const elements = [];
    let canvasWidth = 1080;
    let canvasHeight = 1920; // Default fallback

    // Helper to parse pixel values
    const parsePx = (val) => {
        if (!val) return null;
        if (typeof val === 'number') return val;
        if (val.endsWith('px')) return parseFloat(val);
        if (val.endsWith('%')) return null; // Can't easily handle % without context
        if (val.endsWith('vw')) return null; // Ignore viewport units for specific elements, mainly for canvas size
        return parseFloat(val);
    };

    // Try to find the main frame for dimensions
    const frame = doc.querySelector('.frame') || doc.body;

    // DFS traversal
    function traverse(node, offsetX = 0, offsetY = 0) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            // Create text layer for non-empty text nodes
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                // We need the parent's computed style or at least style attributes
                const parent = node.parentElement;
                const style = parent.style;

                elements.push({
                    id: uid(),
                    type: 'text',
                    name: 'Text Layer',
                    x: offsetX,
                    y: offsetY,
                    width: parsePx(style.width) || 300,
                    height: parsePx(style.height) || 50,
                    content: node.textContent.trim(),
                    fontSize: parsePx(style.fontSize) || 16,
                    fontFamily: style.fontFamily || DEFAULT_FONT, // Use imported default
                    fontWeight: style.fontWeight || 400,
                    color: style.color || '#000000',
                    textAlign: style.textAlign || 'left',
                    lineHeight: parseFloat(style.lineHeight) || 1.2,
                    opacity: parseFloat(style.opacity) || 1,
                    zIndex: elements.length + 1,
                });
            }
            return;
        }

        const style = node.style;

        // Check for canvas dimensions on specific container
        // The user's snippet has a .div inside .frame with dimensions
        if (node.className === 'div' && style.width && style.height) {
            const w = parsePx(style.width);
            const h = parsePx(style.height);
            if (w && h) {
                canvasWidth = w;
                canvasHeight = h;
            }
        }

        let currentX = offsetX;
        let currentY = offsetY;

        // Very basic positioning attempt (mostly assumes block/flow or absolute if styled)
        // In a real email template, everything is flow or table. 
        // For this specific 'frame' > 'div' structure, we assume the inner div is the main container.

        // VISUAL ELEMENT CHECK
        const hasBg = style.backgroundColor || style.background || style.backgroundImage;
        const isImg = node.tagName === 'IMG';

        // If it's a visual block
        if (hasBg || isImg) {
            const width = parsePx(style.width) || 100; // minimal default
            const height = parsePx(style.height) || 100;

            if (isImg) {
                elements.push({
                    id: uid(),
                    type: 'image',
                    name: 'Image Layer',
                    x: currentX,
                    y: currentY,
                    width: width,
                    height: height,
                    content: node.src || 'https://via.placeholder.com/150',
                    fit: style.objectFit || 'cover',
                    opacity: parseFloat(style.opacity) || 1,
                    zIndex: elements.length + 1,
                    borderRadius: parsePx(style.borderRadius) || 0,
                });
            } else if (hasBg) {
                // Parse background - if it's a gradient, we store it in backgroundColor for now if the app supports it, 
                // or we might need a custom field. The app currently uses 'backgroundColor' on 'shape'.
                // If the app only supports solid colors for shapes, we might break gradients.
                // However, looking at the snippet, it uses `background: linear-gradient(...)`.
                // Let's check Canvas.jsx. It uses `backgroundColor` in style.

                elements.push({
                    id: uid(),
                    type: 'shape',
                    name: 'Shape Layer',
                    x: currentX,
                    y: currentY,
                    width: width,
                    height: height,
                    backgroundColor: style.background || style.backgroundColor, // Pass the whole string, React style prop handles gradients usually if in 'background'
                    borderRadius: parsePx(style.borderRadius) || 0,
                    opacity: parseFloat(style.opacity) || 1,
                    zIndex: elements.length + 1,
                    stroke: style.border ? { color: '#000', width: 1 } : null, // simplified
                });
            }
        }

        // Recurse
        Array.from(node.childNodes).forEach(child => traverse(child, currentX, currentY));
    }

    traverse(frame);

    // If we found only one element and it matches the canvas size (bg layer), make sure it's at 0,0
    if (elements.length === 1 && elements[0].width === canvasWidth && elements[0].height === canvasHeight) {
        elements[0].x = 0;
        elements[0].y = 0;
    }

    return { width: canvasWidth, height: canvasHeight, elements };
}
