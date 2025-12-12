import React, { useRef } from "react";

export default function CoordinatePlane({ r, points, onCanvasClick }) {
    const size = 400;
    const center = size / 2;
    const gridDivisions = 5;
    const scale = center / gridDivisions; // 1 единица = scale px

    const svgRef = useRef(null);

    const handleClick = (e) => {
        if (!svgRef.current || r === null) return;

        const rect = svgRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        let x = (clickX - center) / scale;
        let y = (center - clickY) / scale;

        x = Math.round(x * 100) / 100;
        y = Math.round(y * 100) / 100;

        if (x < -3 || x > 5 || y < -3 || y > 5) return;

        if (onCanvasClick) onCanvasClick(x, y, r);
    };

    const renderAxes = () => {
        const lines = [];
        lines.push(<line key="y" x1={center} y1={0} x2={center} y2={size} stroke="black" />);
        lines.push(<line key="x" x1={0} y1={center} x2={size} y2={center} stroke="black" />);

        for (let i = -gridDivisions; i <= gridDivisions; i++) {
            if (i === 0) continue;
            const offset = i * scale;
            lines.push(<line key={`v${i}`} x1={center + offset} y1={center - 5} x2={center + offset} y2={center + 5} stroke="black" />);
            lines.push(<line key={`h${i}`} x1={center - 5} y1={center - offset} x2={center + 5} y2={center - offset} stroke="black" />);
        }

        lines.push(<polygon key="arrowX" points={`${size},${center-5} ${size},${center+5} ${size+10},${center}`} fill="black" />);
        lines.push(<polygon key="arrowY" points={`${center-5},0 ${center+5},0 ${center},-10`} fill="black" />);
        return lines;
    };

    const renderShapes = () => {
        if (!r) return null;

        const rPx = r * scale;

        return [
            // 1-я четверть: квадрат
            <rect key="q1" x={center} y={center - rPx} width={rPx} height={rPx} fill="rgba(0,0,255,0.3)" />,
            // 2-я четверть: треугольник (катет вдоль Y = R/2)
            <polygon
                key="q2"
                points={`${center},${center} ${center - rPx},${center} ${center},${center - rPx/2}`}
                fill="rgba(0,255,0,0.3)"
            />,
            // 3-я четверть: четверть круга
            <path
                key="q3"
                d={`M ${center},${center} L ${center - rPx},${center} A ${rPx} ${rPx} 0 0 0 ${center},${center + rPx} Z`}
                fill="rgba(255,0,0,0.3)"
            />
        ];
    };

    return (
        <svg
            ref={svgRef}
            width={size}
            height={size}
            style={{ border: "1px solid black", backgroundColor: "#f0f8ff" }}
            onClick={handleClick}
        >
            {renderShapes()}
            {renderAxes()}
            {points.map((p, idx) => (
                <circle
                    key={idx}
                    cx={center + p.x * scale}
                    cy={center - p.y * scale}
                    r={4}
                    fill={p.hit ? "green" : "red"}
                />
            ))}
        </svg>
    );
}
