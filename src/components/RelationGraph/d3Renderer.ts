import * as d3 from 'd3';
import { cloneDeep } from 'lodash-es';
import { D3Chart } from './D3Chart';
import { getTextWidth, downloadSvgAsPng } from './d3Utils';

export let chart: D3Chart | undefined;
export let forceSimulation: d3.Simulation<any, any> | undefined;

const config = {
  margins: { top: 10, left: 10, bottom: 10, right: 10 },
  nodeSize: 36,
  nodeBasicWidth: 87,
  nodeRightPadding: 8,
  colorSetting: {
    line: 'rgba(255, 255, 255, 0.15)',
    nodeBorder: '#3b82f6',
    nodeText: '#f8fafc',
    nodeCenterBg: 'rgba(139, 92, 246, 0.2)', // Purple glow
    nodeNeighborBg: 'rgba(59, 130, 246, 0.2)', // Blue glow
    nodeFriendBg: 'rgba(255, 255, 255, 0.05)', // Subtle gray
    nodeCenterBgActive: 'rgba(139, 92, 246, 0.4)',
    nodeNeighborBgActive: 'rgba(59, 130, 246, 0.4)',
    nodeFriendBgActive: 'rgba(255, 255, 255, 0.15)',
    nodeCenterBorder: '#8b5cf6',
    nodeNeighborBorder: '#3b82f6',
    nodeFriendBorder: 'rgba(255, 255, 255, 0.2)',
    labelBg: '#3b82f6',
    labelText: '#FFFFFF',
    labelBorder: '#3b82f6',
  },
};

export function destroyAllPop() {
  if (typeof document === 'undefined') return;
  const existingTooltips = document.querySelectorAll('.node-tooltip');
  existingTooltips.forEach((el) => {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });
}

export function killChart() {
  if (forceSimulation) forceSimulation.stop();
  d3.select('#chart-container .map').remove();
  chart = undefined;
  forceSimulation = undefined;
}

function setBGColor(d: any) {
  if (d.isCenter) return config.colorSetting.nodeCenterBg;
  if (d.isNeighbor) return config.colorSetting.nodeNeighborBg;
  return config.colorSetting.nodeFriendBg;
}

function setBGColorActive(d: any) {
  if (d.isCenter) return config.colorSetting.nodeCenterBgActive;
  if (d.isNeighbor) return config.colorSetting.nodeNeighborBgActive;
  return config.colorSetting.nodeFriendBgActive;
}

function setBorderColor(d: any) {
  if (d.isCenter) return config.colorSetting.nodeCenterBorder;
  if (d.isNeighbor) return config.colorSetting.nodeNeighborBorder;
  return config.colorSetting.nodeFriendBorder;
}

export function renderRelChart({ data, lang, options = {} }: any) {
  const isEn = lang === 'en';
  const nodes = cloneDeep(data.nodes || []);
  const edges = cloneDeep(data.edges || []);

  d3.select('#chart-container .map').remove();
  destroyAllPop();

  chart = new D3Chart();
  const div = document.getElementById('chart-container');
  if (!div) return;

  chart.width(div.offsetWidth);
  chart.height(div.offsetHeight);
  chart.box(d3.select('#chart-container'));
  chart.margins(config.margins);

  nodes.forEach((d: any) => {
    d.x = (chart?.width() as number) / 2 + (Math.random() - 0.5) * 20;
    d.y = (chart?.height() as number) / 2 + (Math.random() - 0.5) * 20;
    
    const textWidth = getTextWidth(d.name || '', 16);
    let requiredWidth = 16 + textWidth + config.nodeRightPadding;
    const maxWidth = 200;
    d.dynamicWidth = Math.max(config.nodeBasicWidth, Math.min(maxWidth, requiredWidth));
    if (textWidth > maxWidth - 16 - config.nodeRightPadding) {
      d.dynamicHeight = 56;
      d.isTwoLines = true;
    } else {
      d.dynamicHeight = config.nodeSize;
      d.isTwoLines = false;
    }
  });

  const formattedEdges = edges.filter((d: any) => {
    const sourceIndex = nodes.findIndex((v: any) => v.id === d.source);
    const targetIndex = nodes.findIndex((v: any) => v.id === d.target);
    if (sourceIndex === -1 || targetIndex === -1) return false;
    d.source = nodes[sourceIndex];
    d.target = nodes[targetIndex];
    return true;
  });

  forceSimulation = d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(formattedEdges).distance(options.distance || 100).strength(1))
    .force('charge', d3.forceManyBody().strength(options.chargeStrength || -200).distanceMax(300))
    .force('x', d3.forceX((chart?.width() as number) / 2).strength(options.centerStrength || 0.08))
    .force('y', d3.forceY((chart?.height() as number) / 2).strength(options.centerStrength || 0.08))
    .force(
      'collision',
      d3.forceCollide().radius((d: any) => Math.hypot(d.dynamicWidth || 100, d.dynamicHeight || 40) / 2 + 10)
    )
    .alphaDecay(0.06);

  let links: any;
  let gs: any;

  const centerNode = nodes.find((n: any) => n.isCenter);
  if (centerNode) {
    centerNode.fx = (chart?.width() as number) / 2;
    centerNode.fy = (chart?.height() as number) / 2 - config.nodeSize / 2;
  }

  chart.renderBody = function () {
    if (!this._body && this._svg) {
      this._body = this._svg.append('g').attr('class', 'body').attr('id', 'body');
      this._zoom = d3.zoom<SVGSVGElement, any>().on('zoom', (event) => {
        destroyAllPop();
        this._body?.attr('transform', event.transform.toString());
      });
      this._svg.call(this._zoom);
      this._svg.on('click', (event) => {
        if (event.target === event.currentTarget) destroyAllPop();
      });
      this._zoom.scaleExtent([0.2, 2]);
    }
    this.render();
  };

  chart.renderLines = () => {
    links = (chart?.body() as d3.Selection<SVGGElement, any, any, any>)
      .append('g')
      .selectAll('path')
      .data(formattedEdges)
      .enter()
      .append('path')
      .attr('class', 'link-line')
      .attr('stroke', config.colorSetting.line)
      .attr('stroke-width', 1.5)
      .attr('fill', 'none');
  };

  chart.renderNodes = function () {
    gs = (chart?.body() as d3.Selection<SVGGElement, any, any, any>)
      .selectAll('.node-group')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .call(d3.drag<SVGGElement, any>()
        .on('start', (e, d) => {
          destroyAllPop();
          if (!e.active) forceSimulation?.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (e, d) => {
          d.fx = e.x;
          d.fy = e.y;
        })
        .on('end', (e, d) => {
          if (!e.active) forceSimulation?.alphaTarget(0);
          if (!d.isCenter) {
            d.fx = null;
            d.fy = null;
          }
        })
      );

    gs.append('rect')
      .attr('class', 'node')
      .attr('x', (d: any) => -d.dynamicWidth / 2)
      .attr('y', (d: any) => -d.dynamicHeight / 2)
      .attr('width', (d: any) => d.dynamicWidth)
      .attr('height', (d: any) => d.dynamicHeight)
      .attr('fill', (d: any) => setBGColor(d))
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('stroke', (d: any) => setBorderColor(d))
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    gs.append('text')
      .attr('class', 'node-text')
      .attr('fill', config.colorSetting.nodeText)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '14px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .text((d: any) => d.short_name);
  };

  function ticked() {
    links.attr('d', (d: any) => {
      return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
    });
    gs.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
  }

  forceSimulation.on('tick', ticked);

  chart.render = function () {
    this.renderLines();
    this.renderNodes();
    bindEvents();
    return this;
  };

  chart.renderChart({});

  function bindEvents() {
    gs.on('mouseover', (e: any, d: any) => {
      const connectedNodeIds = new Set([d.id]);
      formattedEdges.forEach((l: any) => {
        if (l.source.id === d.id) connectedNodeIds.add(l.target.id);
        if (l.target.id === d.id) connectedNodeIds.add(l.source.id);
      });

      gs.attr('opacity', (o: any) => (connectedNodeIds.has(o.id) ? 1 : 0.1));
      links.attr('opacity', (l: any) => (l.source.id === d.id || l.target.id === d.id ? 1 : 0.05));
    });

    gs.on('mouseout', () => {
      gs.attr('opacity', 1);
      links.attr('opacity', 1);
    });

    gs.on('click', (e: any, d: any) => {
      e.stopPropagation();
      showTooltip(e, d);
    });
  }

  function showTooltip(event: any, d: any) {
    destroyAllPop();
    const container = document.getElementById('chart-container');
    if (!container) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'node-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${event.pageX - container.getBoundingClientRect().left + 10}px`;
    tooltip.style.top = `${event.pageY - container.getBoundingClientRect().top + 10}px`;
    tooltip.style.background = 'rgba(22, 22, 26, 0.95)';
    tooltip.style.backdropFilter = 'blur(10px)';
    tooltip.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    tooltip.style.padding = '16px';
    tooltip.style.borderRadius = '12px';
    tooltip.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
    tooltip.style.zIndex = '1000';
    tooltip.style.minWidth = '240px';
    tooltip.style.color = '#f8fafc';

    tooltip.innerHTML = `
      <div style="font-weight: 800; font-size: 18px; margin-bottom: 6px; color: #fff;">${d.full_name || d.name}</div>
      <div style="color: #94a3b8; font-size: 14px; margin-bottom: 12px;">战绩: <span style="color: #3b82f6;">${d.records || '暂无数据'}</span></div>
      <div style="margin-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 12px;">
        <button style="background: #3b82f6; color: #fff; border: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; width: 100%; transition: all 0.2s;">查看详情</button>
      </div>
    `;

    container.appendChild(tooltip);
    
    tooltip.querySelector('button')?.addEventListener('click', () => {
      if (options.onNodeClick) options.onNodeClick(d);
      destroyAllPop();
    });
  }
}

export async function saveChartAsImage(lang: string) {
    const svg = document.querySelector('#chart-container .map') as SVGSVGElement;
    if (!svg) return;
    
    const { width, height } = (document.getElementById('body') as any).getBBox();
    const padding = 50;

    return downloadSvgAsPng(svg, `TableTennis_Relation_${new Date().getTime()}.png`, {
        width: width + padding * 2,
        height: height + padding * 2,
        left: -padding,
        top: -padding,
        scale: 2
    });
}
