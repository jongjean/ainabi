'use client';

import React, { useEffect, useRef } from 'react';

const RelationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth;
        canvas.height = containerRef.current.offsetHeight;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const nodes = [
      { x: 100, y: 150, label: '문제', color: '#00E5FF' },
      { x: 250, y: 80, label: '관계', color: '#00E5FF' },
      { x: 400, y: 150, label: '감정', color: '#00E5FF' },
      { x: 250, y: 250, label: '전략', color: '#00E5FF' },
      { x: 150, y: 320, label: '행동', color: '#00E5FF' },
      { x: 350, y: 320, label: '결과', color: '#00E5FF' }
    ];

    const links = [
      [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]
    ];

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    let animationFrame: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Links
      links.forEach(([a, b]) => {
        const nodeA = nodes[a];
        const nodeB = nodes[b];
        
        // Calculate dynamic relative positions if needed, but here we use relative scale
        const scaleX = canvas.width / 500;
        const scaleY = canvas.height / 400;

        ctx.beginPath();
        ctx.moveTo(nodeA.x * scaleX, nodeA.y * scaleY);
        ctx.lineTo(nodeB.x * scaleX, nodeB.y * scaleY);

        ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw Nodes
      nodes.forEach((node) => {
        const scaleX = canvas.width / 500;
        const scaleY = canvas.height / 400;
        const nx = node.x * scaleX;
        const ny = node.y * scaleY;

        const dx = mouse.x - nx;
        const dy = mouse.y - ny;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const glow = dist < 70;

        // Glow outer ring
        if (glow) {
          ctx.beginPath();
          ctx.arc(nx, ny, 15, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 255, 163, 0.1)';
          ctx.fill();
          
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#00FFA3';
        } else {
          ctx.shadowBlur = 0;
        }

        // Inner Circle
        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fillStyle = glow ? '#00FFA3' : '#00E5FF';
        ctx.fill();

        // Glow reset for text
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = glow ? '#fff' : 'rgba(255, 255, 255, 0.8)';
        ctx.font = glow ? 'bold 12px sans-serif' : '11px sans-serif';
        ctx.fillText(node.label, nx + 12, ny + 4);
      });

      animationFrame = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={containerRef} className="relation-box" style={{ 
      width: '100%', 
      height: '400px', 
      position: 'relative',
      background: 'rgba(0, 229, 255, 0.03)',
      borderRadius: '24px',
      border: '1px solid rgba(0, 229, 255, 0.1)',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
    </div>
  );
};

export default RelationCanvas;
