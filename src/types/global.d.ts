declare module 'save-svg-as-png' {
  export function saveSvgAsPng(el: Node, name: string, options?: any): void;
  export function svgAsDataUri(el: Node, options?: any): Promise<string>;
  export function svgAsPngUri(el: Node, options?: any): Promise<string>;
}
