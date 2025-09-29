"use client";
import Controller, { OnSubmitChangesParams } from "@/components/controller";
import drawUtils from "@/utils/drawUtils";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_RECTANGLE_SIZE = {
  width: 100,
  height: 100,
};

const DEFAULT_RECTANGLE_ORIGIN_COORDINATES = {
  x: 100,
  y: 100,
};

const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [rectangleOriginCoordinates, setRectangleOriginCoordinates] = useState({
    x: 100,
    y: 100,
  });

  const handleSubmitChanges = useCallback(
    (params: OnSubmitChangesParams) => {
      console.log(params);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) {
        return;
      }

      if (
        params.position &&
        params.position.x !== rectangleOriginCoordinates.x &&
        params.position.y !== rectangleOriginCoordinates.y
      ) {
        drawUtils.clearGridRectangle(
          ctx,
          rectangleOriginCoordinates.x,
          rectangleOriginCoordinates.y,
          DEFAULT_RECTANGLE_SIZE.width,
          DEFAULT_RECTANGLE_SIZE.height,
        );

        setRectangleOriginCoordinates({
          x: params.position.x,
          y: params.position.y,
        });

        drawUtils.drawRectangle({
          canvasContext: ctx,
          width: DEFAULT_RECTANGLE_SIZE.width,
          height: DEFAULT_RECTANGLE_SIZE.height,
          positionX: params.position.x,
          positionY: params.position.y,
        });
      }
    },
    [rectangleOriginCoordinates],
  );

  const drawRectangle = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    drawUtils.drawRectangle({
      canvasContext: ctx,
      width: 100,
      height: 100,
      positionX: DEFAULT_RECTANGLE_ORIGIN_COORDINATES.x,
      positionY: DEFAULT_RECTANGLE_ORIGIN_COORDINATES.y,
    });
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
      gridSpacing: 50,
      gridWidth: 2,
    });

    drawRectangle();
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
