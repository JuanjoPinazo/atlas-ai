"use client";

import React from 'react';

interface Props {
  dimensions: { name: string; score: number }[];
}

export function MaturityRadar({ dimensions }: Props) {
  // SVG Radar Implementation (Spider Chart)
  const size = 300;
  const center = size / 2;
  const radius = (size - 60) / 2;
  const numPoints = dimensions.length;
  
  const getCoordinatesForAngle = (angle: number, distance: number) => {
    const x = center + distance * Math.cos(angle - Math.PI / 2);
    const y = center + distance * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  const dataPoints = dimensions.map((d, i) => {
    const angle = (Math.PI * 2 * i) / numPoints;
    const distance = (d.score / 100) * radius;
    return getCoordinatesForAngle(angle, distance);
  });

  const pathData = dataPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z';

  // Grid background
  const gridLevels = [0.25, 0.5, 0.75, 1];
  
  return (
    <div className="relative flex justify-center items-center w-full aspect-square max-w-[400px] mx-auto">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Grid lines */}
        {gridLevels.map(level => {
          const points = Array.from({ length: numPoints }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / numPoints;
            const p = getCoordinatesForAngle(angle, radius * level);
            return `${p.x},${p.y}`;
          });
          return (
            <polygon 
              key={`grid-${level}`} 
              points={points.join(' ')} 
              fill="none" 
              stroke="rgba(99, 102, 241, 0.2)" 
              strokeWidth="1" 
            />
          );
        })}

        {/* Axis lines */}
        {Array.from({ length: numPoints }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / numPoints;
          const end = getCoordinatesForAngle(angle, radius);
          return (
            <line 
              key={`axis-${i}`} 
              x1={center} y1={center} 
              x2={end.x} y2={end.y} 
              stroke="rgba(99, 102, 241, 0.2)" 
              strokeWidth="1" 
            />
          );
        })}

        {/* Data polygon */}
        <path 
          d={pathData} 
          fill="rgba(99, 102, 241, 0.4)" 
          stroke="rgb(129, 140, 248)" 
          strokeWidth="3" 
          className="transition-all duration-1000"
        />

        {/* Data points and labels */}
        {dimensions.map((d, i) => {
          const angle = (Math.PI * 2 * i) / numPoints;
          const p = dataPoints[i];
          const labelP = getCoordinatesForAngle(angle, radius + 25);
          
          return (
            <g key={`data-${i}`}>
              <circle cx={p.x} cy={p.y} r="4" fill="white" className="shadow-lg" />
              <text 
                x={labelP.x} 
                y={labelP.y} 
                textAnchor="middle" 
                alignmentBaseline="middle"
                fill="rgba(148, 163, 184, 1)"
                fontSize="12"
                fontWeight="bold"
              >
                {d.name} ({d.score})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
