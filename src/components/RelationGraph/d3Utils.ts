import saveSvgAsPng from 'save-svg-as-png';

/**
 * Calculates text width using a temporary canvas
 */
export const getTextWidth = (text: string, fontSize: number): number => {
  if (typeof document === 'undefined') return 0;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 0;
  context.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Segoe UI, Arial, Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft Yahei", sans-serif`;
  return context.measureText(text).width;
};

interface DownloadOptions {
  width: number;
  height: number;
  left: number;
  top: number;
  scale?: number;
}

/**
 * Downloads SVG as PNG
 */
export const downloadSvgAsPng = (svg: SVGSVGElement, name: string, options: DownloadOptions) => {
  const waterMark = svg.querySelector('#water-mark');
  if (waterMark) {
    waterMark.remove();
  }
  
  return (saveSvgAsPng as any).saveSvgAsPng(svg, name, {
    backgroundColor: '#fff',
    ...options,
    scale: options.scale || 1,
  });
};
