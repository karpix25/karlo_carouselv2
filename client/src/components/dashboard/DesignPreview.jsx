import React, { useMemo } from 'react';
import { getFontStack } from '../../constants/fonts';

const hexToRgba = (hex, opacity = 1) => {
    if (!hex) return 'rgba(0, 0, 0, 1)';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const getBackground = (el) => {
    if (el.gradient?.enabled) {
        const { start, end, angle, stops } = el.gradient;
        if (stops && stops.length > 0) {
            const sortedStops = [...stops].sort((a, b) => a.position - b.position);
            const stopString = sortedStops.map(stop => {
                const color = hexToRgba(stop.color, stop.opacity);
                return `${color} ${stop.position}%`;
            }).join(', ');
            return `linear-gradient(${angle}deg, ${stopString})`;
        }
        const startColor = hexToRgba(start, el.gradient.startOpacity ?? 1);
        const endColor = hexToRgba(end, el.gradient.endOpacity ?? 1);
        return `linear-gradient(${angle}deg, ${startColor}, ${endColor})`;
    }
    return el.backgroundColor || '#333';
};

const RenderElement = ({ el }) => {
    if (el.visible === false) return null;

    const style = {
        position: 'absolute',
        left: el.x || 0,
        top: el.y || 0,
        width: el.width || 0,
        height: el.height || 0,
        transform: `rotate(${el.rotation || 0}deg)`,
        opacity: el.opacity ?? 1,
        zIndex: el.zIndex || 0,
        borderRadius: el.borderRadius || 0,
        overflow: 'hidden',
    };

    if (el.type === 'image') {
        return (
            <div style={style}>
                <img
                    src={el.content || el.src}
                    alt=""
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: el.fit || 'cover',
                    }}
                />
            </div>
        );
    }

    if (el.type === 'shape') {
        return <div style={{ ...style, background: getBackground(el) }} />;
    }

    if (el.type === 'text') {
        return (
            <div
                style={{
                    ...style,
                    display: 'flex',
                    alignItems: el.verticalAlign === 'middle' ? 'center' : el.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start',
                    textAlign: el.textAlign || 'left',
                    fontSize: el.fontSize || 18,
                    color: el.color || '#fff',
                    fontWeight: el.fontWeight || 400,
                    fontFamily: getFontStack(el.fontFamily),
                    lineHeight: el.lineHeight || 1.2,
                    padding: el.padding ? `${el.padding}px` : undefined,
                    backgroundColor: el.backgroundColor ? hexToRgba(el.backgroundColor, el.backgroundOpacity ?? 1) : 'transparent',
                }}
            >
                <span style={{ width: '100%', whiteSpace: 'pre-wrap' }}>{el.content}</span>
            </div>
        );
    }

    return null;
};

export default function DesignPreview({ template, scale = 1 }) {
    if (!template) return null;

    const { width = 1600, height = 2000, elements = [] } = template;

    return (
        <div
            style={{
                width: width * scale,
                height: height * scale,
                backgroundColor: '#1f1f1f', // Match editor dark background
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                borderRadius: '4px',
            }}
        >
            <div
                style={{
                    width,
                    height,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                }}
            >
                {elements.map((el) => (
                    <RenderElement key={el.id} el={el} />
                ))}
            </div>
        </div>
    );
}
