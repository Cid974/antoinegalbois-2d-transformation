"use client";
import Controller, { OnSubmitChangesParams } from "@/components/controller";
import drawUtils from "@/utils/drawUtils";
import { useEffect, useRef, useState } from "react";

const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const handleSubmitChanges = (params: OnSubmitChangesParams) => {
    console.log(params);
  };

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();

      setCanvasSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateCanvasSize();

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (!containerRef.current) {
      return;
    }

    resizeObserver.observe(containerRef.current);

    window.addEventListener("resize", updateCanvasSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    drawUtils.drawCoordinateGrid(ctx, {
      width: canvas.width,
      height: canvas.height,
      axisWidth: 2,
      axisColor: "gray",
      gridSpacing: 20,
      gridWidth: 2,
    });

    drawUtils.drawRectangle({
      canvasContext: ctx,
      width: 100,
      height: 100,
      positionX: 20,
      positionY: 20,
    });
  }, [canvasSize, canvasRef]);

  return (
    <div
      id="container"
      className="bg-white text-black flex flex-row items-center justify-center h-screen"
    >
      <div
        id="canvas-container"
        ref={containerRef}
        className="flex border-2 border-blue-500 flex-1"
        style={{ height: "calc(100% - 20px)" }}
      >
        <canvas
          id="canvas"
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border-2 border-red-500"
        />
      </div>
      <div
        id="controls-container"
        className="flex flex-1 flex-col items-center justify-center border-2 border-red-500"
      >
        <Controller onSubmitChanges={handleSubmitChanges} />
      </div>
    </div>
  );
};

export default Landing;
