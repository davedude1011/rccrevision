"use client"

import { useEffect, useRef, useState } from "react";
import { LuInfo } from "react-icons/lu";
import { Layer, Rect, Stage } from "react-konva";

export function data() {
    return {
        title: "Example Interactable",
        description: "an example description.",
        icon: <LuInfo className="text-blue-500" />,
        subject: "Maths"
    }
}

export function Visual() {
    const containerElementRef = useRef<HTMLDivElement | null>(null)

    const [canvasDimensions, setCanvasDimensions] = useState({width: 20, height: 20})
    useEffect(() => {
        if (containerElementRef.current) {
            setCanvasDimensions({
                width: containerElementRef.current.clientWidth,
                height: containerElementRef.current.clientHeight
            })
        }
    }, [])
    
    return (
        <div ref={containerElementRef} className="w-full h-full">
            <Stage width={canvasDimensions.width} height={canvasDimensions.height}>
                <Layer>
                    {
                        new Array(Math.round(canvasDimensions.width / 20)).fill("").map((_, index) => (
                            <Rect key={index} x={20*index} y={20} width={20} height={20} fill={"blue"} draggable></Rect>
                        ))
                    }
                </Layer>
            </Stage>
        </div>
    )
}

const interactable = {
    data,
    Visual
}

export default interactable