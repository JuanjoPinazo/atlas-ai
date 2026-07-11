"use client";

import React from 'react';

interface RadarData {
  category: string;
  score: number; // 0 to 100
}

export function RadarChart({ data }: { data: RadarData[] }) {
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 40;
  const levels = 5;

  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    const x = center + radius * Math.cos(angle) * (d.score / 100);
    const y = center + radius * Math.sin(angle) * (d.score / 100);
    return { x, y, label: d.category, score: d.score, angle };
  });

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background grids */}
        {[...Array(levels)].map((_, i) => {
          const r = radius * ((i + 1) / levels);
          const gridPoints = data.map((_, j) => {
            const angle = (Math.PI * 2 * j) / data.length - Math.PI / 2;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ');
          
          return (
            <polygon 
              key={`grid-${i}`} 
              points={gridPoints} 
              fill="none" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="1" 
            />
          );
        })}

        {/* Axes */}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line 
              key={`axis-${i}`} 
              x1={center} 
              y1={center} 
              x2={x} 
              y2={y} 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="1" 
            />
          );
        })}

        {/* Data Polygon */}
        <polygon 
          points={polygonPath} 
          fill="rgba(99, 102, 241, 0.2)" 
          stroke="rgba(99, 102, 241, 0.8)" 
          strokeWidth="2" 
        />

        {/* Data Points and Labels */}
        {points.map((p, i) => {
          const labelX = center + (radius + 20) * Math.cos(p.angle);
          const labelY = center + (radius + 20) * Math.sin(p.angle);
          
          return (
            <g key={`point-${i}`}>
              <circle cx={p.x} cy={p.y} r="4" fill="rgb(99, 102, 241)" />
              <text 
                x={labelX} 
                y={labelY} 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                fill="#94a3b8" 
                fontSize="12"
                fontWeight="500"
              >
                {p.label}
              </text>
              <text 
                x={labelX} 
                y={labelY + 14} 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                fill="#fff" 
                fontSize="14"
                fontWeight="bold"
              >
                {p.score}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
