'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GraphData {
  nodes: string[];
  edges: string[][];
}

export default function CausalGraph({ data }: { data: GraphData }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;

    // 데이터가 없을 때의 '스캐닝(Scanning)' 모드 연출
    if (data.nodes.length === 0) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#00E5FF")
        .attr("class", "text-sm animate-pulse")
        .text("신경망 기반 인과 분석 엔진 초기화 중...");
      return;
    }

    const nodes = data.nodes.map(n => ({ id: n }));
    const links = data.edges.map(e => ({ source: e[0], target: e[1] }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // 글로우 효과 정의 (SVG Filter)
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "3.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // 엣지(연결선) - 네온 그린 라인
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(204, 255, 0, 0.4)")
      .attr("stroke-width", 2)
      .style("filter", "url(#glow)");

    // 노드(정점) - 맥동하는 사이버 코어
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // 외부 오라(Aura)
    node.append("circle")
      .attr("r", 12)
      .attr("fill", "rgba(204, 255, 0, 0.1)")
      .attr("class", "animate-pulse");

    // 중심 코어
    node.append("circle")
      .attr("r", 5)
      .attr("fill", "#00E5FF")
      .style("filter", "url(#glow)");

    // 레이블 (텍스트)
    node.append("text")
      .text((d: any) => d.id)
      .attr("x", 12)
      .attr("y", 4)
      .attr("fill", "#E5E5E5")
      .attr("class", "text-[10px] font-mono tracking-tighter shadow-sm");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

  }, [data]);

  return (
    <div className="relative w-full aspect-[3/2] bg-ainabi-dark/30 overflow-hidden border border-ainabi-blue/10 shadow-inner">
      <div className="absolute top-2 left-2 text-[8px] font-mono text-ainabi-blue/40 uppercase tracking-[0.2em]">인과 논리 HUD - 실시간 시뮬레이션 가동 중</div>
      <svg 
        ref={svgRef} 
        viewBox="0 0 600 400" 
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      ></svg>
    </div>
  );
}
