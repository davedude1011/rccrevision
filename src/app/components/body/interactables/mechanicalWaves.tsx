"use client"

import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { LuInfo } from "react-icons/lu";
import { Circle, Layer, Rect, Stage } from "react-konva";
import { getTrackBackground, Range } from "react-range";

export function data() {
    return {
        title: "Mechanical Waves",
        description: "an example description.",
        icon: <LuInfo className="text-blue-500" />,
        subject: "Physics"
    }
}

interface ParticleProps {
    baseX: number;
    baseY: number;
    shiftAmount: number;
    isShift: boolean;
    waveType: string;
    radius: number;
    preDegree: number;
  }
  
  export function Particle({
    baseX,
    baseY,
    shiftAmount,
    isShift,
    waveType,
    radius,
    preDegree,
  }: ParticleProps) {
    const [degree, setDegree] = useState(preDegree);
    const circleRef = useRef<Konva.Circle>(null);
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (waveType === "transverse") {
          setDegree((prevDegree) => (prevDegree + 10) % 360);
        }
      }, 5); // Update position every 100ms
  
      return () => clearInterval(interval);
    }, [waveType]);
  
    // @ts-expect-error uhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
    useEffect(() => {
      const layer = circleRef.current?.getLayer();
      if (!layer) return;
  
      const anim = new Konva.Animation((frame) => {
        if (circleRef.current) {
          if (waveType === "longitudinal") {
            circleRef.current.position({
              x: isShift ? baseX+22 + shiftAmount : baseX+22,
              y: baseY+22,
            });
          } else {
            const radian = (degree * Math.PI) / 180;
            const circularX = baseX + radius * Math.cos(radian);
            const circularY = baseY-(isMobile ? 30*8 : 0) + radius * Math.sin(radian);
            circleRef.current.position({ x: circularX, y: circularY });
          }
          layer.batchDraw(); // Batch draw to improve performance
        }
      }, layer);
  
      anim.start();
      return () => anim.stop();
    }, [degree, waveType, baseX, baseY, shiftAmount, radius, isShift]);
  
    return (
      <Circle
        ref={circleRef}
        radius={40 / 2}
        stroke="blue"
      />
    );
  }
  
  // Main Component
  export function Visual() {
    const containerElementRef = useRef<HTMLDivElement | null>(null);
    const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 20, height: 20 });
    const [waveType, setWaveType] = useState("longitudinal");
    const [particleEnergy, setParticleEnergy] = useState(20);
    
    useEffect(() => {
        if (containerElementRef.current) {
          setCanvasDimensions({
            width: containerElementRef.current.clientWidth,
            height: containerElementRef.current.clientHeight,
          });
        }
      }, []);
  
    const particleDimensions = [
      waveType === "longitudinal"
        ? Math.round(canvasDimensions.height / 40)
        : Math.round((canvasDimensions.height) / 40)-(isMobile ? 12 : 15),
      waveType === "longitudinal"
        ? Math.round(canvasDimensions.width / 40)
        : Math.round((canvasDimensions.width) / 40)+4
    ];
  
    const [longitudinalShiftX, setLongitudinalShiftX] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (waveType === "longitudinal") {
            // @ts-expect-error hm nice
          setLongitudinalShiftX((prev) => (prev < particleDimensions[1] ? prev + 1 : 0));
        } else {
          setLongitudinalShiftX(0);
        }
      }, 100); // Update position every 100ms
  
      return () => clearInterval(interval);
    }, [waveType, particleDimensions]);
  
    return (
        <div ref={containerElementRef} className="w-full h-full flex flex-col overflow-hidden">
        <div className="w-full h-fit flex flex-col md:flex-row items-center gap-8 justify-center md:justify-between p-6">
          <div className="w-fit flex flex-row gap-2">
            {["Transverse", "Longitudinal"].map((buttonType) => (
              <button
                key={buttonType}
                className={`hover:opacity-100 opacity-50 transition-all p-1 px-4 rounded-md border ${
                  waveType === buttonType.toLowerCase() ? "border-white" : ""
                }`}
                onClick={() => setWaveType(buttonType.toLowerCase())}
              >
                {buttonType}
              </button>
            ))}
            </div>
            <Range
                onChange={(values) => setParticleEnergy(values[0]??0)}
                values={[particleEnergy]} 
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
                            values: [particleEnergy]
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
        <div className="h-full w-full overflow-hidden relative mt-2">
        <Stage width={canvasDimensions.width} height={canvasDimensions.height}>
            <Layer>
              {//@ts-expect-error hm nice
              Array.from({ length: particleDimensions[0] }, (_, i) =>
                //@ts-expect-error hm nice
                Array.from({ length: particleDimensions[1] }, (_, j) => (
                  <Particle
                    key={`${i}-${j}`}
                    baseX={waveType === "longitudinal" ? j * (40) : (j - 2) * (40)}
                    isShift={longitudinalShiftX === j}
                    baseY={waveType === "longitudinal" ? i * (40) : i * (40) + 40*15}
                    shiftAmount={particleEnergy}
                    waveType={waveType}
                    //@ts-expect-error hm nice
                    radius={((particleDimensions[0] - i) * particleEnergy) / 10}
                    preDegree={j * 8}
                  />
                ))
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }

const interactable = {
    data,
    Visual
}

export default interactable