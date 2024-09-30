"use client"

import { useEffect, useRef, useState } from "react";
import { LuAtom } from "react-icons/lu";
import { Circle, Layer, Stage } from "react-konva";

import Konva from "konva";
import { type KonvaEventObject } from "konva/lib/Node";
import { getTrackBackground, Range } from "react-range";

export function data() {
    return {
        title: "States of Matter",
        description: "A visual representation of States of Matter, adjustable Internal Energy slider.",
        icon: <LuAtom className="text-blue-500" size={24} />,
        subject: "Physics"
    }
}

interface Particle {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
    vx: number;
    vy: number;
  }
  
  export function Visual() {
    const containerElementRef = useRef<HTMLDivElement | null>(null);
    const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 20, height: 20 });
    const [internalEnergy, setInternalEnergy] = useState<number>(5);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [initialParticles, setInitialParticles] = useState<Particle[]>([]);
    const atomeSize = 40;
    const padding = 2;
    const movementLimit = atomeSize / 4;
    const layerRef = useRef<Konva.Layer>(null);
  
    // Set the canvas dimensions dynamically
    useEffect(() => {
      if (containerElementRef.current) {
        setCanvasDimensions({
          width: containerElementRef.current.clientWidth,
          height: containerElementRef.current.clientHeight,
        });
      }
    }, []);
  
    // Initialize particles
    useEffect(() => {
      const numRows = Math.round(canvasDimensions.height / atomeSize);
      const numCols = Math.round(canvasDimensions.width / atomeSize);
      const initParticles: Particle[] = [];
  
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          initParticles.push({
            x: (atomeSize + padding) * (col + 0.5),
            y: (atomeSize + padding) * (row + 0.5),
            originalX: (atomeSize + padding) * (col + 0.5),
            originalY: (atomeSize + padding) * (row + 0.5),
            vx: 0,
            vy: 0,
          });
        }
      }
      setInitialParticles(initParticles);
      setParticles(initParticles);
    }, [canvasDimensions]);
  
    //@ts-expect-error uhhhhhh...
    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const anim = new Konva.Animation(() => {
        setParticles((prevParticles) =>
          prevParticles.map((particle) => {
            // eslint-disable-next-line prefer-const
            let { x, y, vx, vy, originalX, originalY } = particle;
  
            // Behavior based on internal energy
            if (internalEnergy === 0) {
              vx = 0;
              vy = 0;
              // Restrict movement in solid state
              const dx = x - originalX;
              const dy = y - originalY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance > movementLimit) {
                // Keep particle within a quarter of its size from original position
                const angle = Math.atan2(dy, dx);
                x = originalX + Math.cos(angle) * movementLimit;
                y = originalY + Math.sin(angle) * movementLimit;
              }
            } else if (internalEnergy <= 45) {
              vx = (Math.random() - 0.5) * internalEnergy * 0.05;
              vy = (Math.random() - 0.5) * internalEnergy * 0.05;
            } else if (internalEnergy <= 85) {
              vx = (Math.random() - 0.5) * 3;
              vy = (Math.random() - 0.5) * 3;
            } else {
              vx += (Math.random() - 0.5) * internalEnergy * 0.1;
              vy += (Math.random() - 0.5) * internalEnergy * 0.1;
            }
  
            x += vx;
            y += vy;
  
            // Boundary detection for gas state
            if (internalEnergy > 85) {
              if (x > canvasDimensions.width) x = 0;
              if (x < 0) x = canvasDimensions.width;
              if (y > canvasDimensions.height) y = 0;
              if (y < 0) y = canvasDimensions.height;
            }
  
            return { x, y, vx, vy, originalX, originalY };
          })
        );
      }, layerRef.current);
  
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      anim.start();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return () => anim.stop();
    }, [internalEnergy, canvasDimensions, movementLimit]);
  
    // Determine which particles to display based on internal energy
    const displayedParticles = internalEnergy > 85 
      ? particles.filter((_, index) => index % 30 === 0) // Further reduce particle count for gas state
      : particles;
  
    // Reset function to restore particles and reset energy
    const resetParticles = () => {
      setParticles(initialParticles);
      setInternalEnergy(0);
    };
  
    // Handle drag move event for particles
    const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
      const { x, y } = e.target.position();
      setParticles((prevParticles) =>
        prevParticles.map((particle) =>
          particle.x === e.target.x() && particle.y === e.target.y()
            ? { ...particle, x, y }
            : particle
        )
      );
    };
  
    return (
      <div ref={containerElementRef} className="w-full h-full flex flex-col overflow-hidden">
        <div className="flex flex-col gap-2 max-w-96 p-6">
            <div className="flex flex-row justify-between items-end">
                <div className="text-2xl">Internal Energy:</div>
                <button onClick={resetParticles} className="w-fit px-4 py-1 border opacity-50 hover:opacity-100 rounded-md transition-all">Reset</button>
            </div>
            <Range
                onChange={(values) => setInternalEnergy(values[0]??0)}
                values={[internalEnergy]} 
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        style={{
                        ...props.style,
                        height: "6px",
                        width: "100%",
                        borderRadius: "50px",
                        background: getTrackBackground({
                            colors: ["white", "#ccc"],
                            min: 0,
                            max: 100,
                            values: [internalEnergy]
                        }),
                        }}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div
                    {...props}
                    key={props.key}
                    style={{
                        ...props.style,
                        height: "12px",
                        width: "12px",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                        backgroundColor: "white",
                        outline: "none",
                    }}
                    />
                )} />
        </div>
        <Stage width={canvasDimensions.width} height={canvasDimensions.height}>
          <Layer ref={layerRef}>
            {displayedParticles.map((particle, index) => (
              <Circle
                key={index}
                x={particle.x}
                y={particle.y}
                radius={atomeSize / 2}
                /*
                fill={internalEnergy > 85 ? "red" : internalEnergy > 45 ? "orange" : "blue"}
                stroke="black"
                */
                stroke={internalEnergy > 85 ? "red" : internalEnergy > 45 ? "orange" : "blue"}
                strokeWidth={2}
                draggable
                onDragMove={handleDragMove}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }

const interactable = {
    data,
    Visual
}

export default interactable