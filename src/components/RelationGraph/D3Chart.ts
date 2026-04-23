import * as d3 from 'd3';

export interface Margins {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface Padding {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export class D3Chart {
  protected _width: number = 2000;
  protected _height: number = 1000;
  protected _margins: Margins = { top: 30, left: 30, right: 30, bottom: 30 };
  protected _data: any[] = [];
  protected _colors: d3.ScaleOrdinal<string, string> = d3.scaleOrdinal(d3.schemeCategory10);
  protected _box: d3.Selection<any, any, any, any> | null = null;
  protected _svg: d3.Selection<SVGSVGElement, any, any, any> | null = null;
  protected _body: d3.Selection<SVGGElement, any, any, any> | null = null;
  protected _padding: Padding = { top: 10, left: 10, right: 10, bottom: 10 };
  protected _zoom: d3.ZoomBehavior<SVGSVGElement, any> | null = null;

  constructor() {}

  width(w?: number): number | this {
    if (w === undefined) return this._width;
    this._width = w;
    return this;
  }

  height(h?: number): number | this {
    if (h === undefined) return this._height;
    this._height = h;
    return this;
  }

  margins(m?: Margins): Margins | this {
    if (m === undefined) return this._margins;
    this._margins = m;
    return this;
  }

  data(d?: any[]): any[] | this {
    if (d === undefined) return this._data;
    this._data = d;
    return this;
  }

  svg(s?: d3.Selection<SVGSVGElement, any, any, any>): d3.Selection<SVGSVGElement, any, any, any> | this {
    if (s === undefined) return this._svg!;
    this._svg = s;
    return this;
  }

  body(b?: d3.Selection<SVGGElement, any, any, any>): d3.Selection<SVGGElement, any, any, any> | this {
    if (b === undefined) return this._body!;
    this._body = b;
    return this;
  }

  box(b?: d3.Selection<any, any, any, any>): d3.Selection<any, any, any, any> | this {
    if (b === undefined) return this._box!;
    this._box = b;
    return this;
  }

  getBodyWidth(): number {
    const width = this._width - this._margins.left - this._margins.right;
    return width > 0 ? width : 0;
  }

  getBodyHeight(): number {
    const height = this._height - this._margins.top - this._margins.bottom;
    return height > 0 ? height : 0;
  }

  padding(p?: Padding): Padding | this {
    if (p === undefined) return this._padding;
    this._padding = p;
    return this;
  }

  render(): this {
    return this;
  }

  bodyX(): number {
    return this._margins.left;
  }

  bodyY(): number {
    return this._margins.top;
  }

  scaleTo(n: number) {
    if (this._zoom && this._svg) {
      this._zoom.scaleTo(this._svg, n || 1);
    }
  }

  // Define dynamic methods to satisfy TypeScript
  renderLines() {}
  renderNodes() {}
  defines() {}

  renderBody() {
    if (!this._body && this._svg) {
      this._body = this._svg
        .append('g')
        .attr('class', 'body')
        .attr('id', 'body');

      this._zoom = d3.zoom<SVGSVGElement, any>().on('zoom', (event) => {
        this._body?.attr('transform', event.transform.toString());
      });
      
      this._svg.call(this._zoom);
      this._zoom.scaleExtent([0.1, 2]);
      this._zoom.translateBy(this._svg, 0, this._height / 2);
    }

    this.render();
  }

  renderChart({ funcBeforeRender }: { funcBeforeRender?: () => void } = {}) {
    if (!this._box) {
      this._box = d3
        .select('body')
        .append('div')
        .attr('class', 'box');
    }

    if (!this._svg && this._box) {
      this._svg = this._box
        .append('svg')
        .attr('id', 'svg')
        .attr('class', 'map')
        .attr('width', this._width)
        .attr('height', this._height)
        .attr('style', 'box-sizing:content-box');
    }

    if (funcBeforeRender) {
      funcBeforeRender();
    }

    this.renderBody();
  }
}
