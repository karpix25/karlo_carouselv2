import { useEffect } from 'react';
import { getFontImportUrl } from '../constants/fonts';

const loadedFonts = new Set();

export default function useFontLoader(fontFamilies = []) {
  useEffect(() => {
    fontFamilies
      .filter(Boolean)
      .forEach((family) => {
        if (loadedFonts.has(family)) {
          return;
        }
        const href = getFontImportUrl(family);
        if (!href) {
          loadedFonts.add(family);
          return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.dataset.fontFamily = family;
        document.head.appendChild(link);
        loadedFonts.add(family);
      });
  }, [fontFamilies]);
}
