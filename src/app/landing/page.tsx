'use client'
import Controller, {TransformationData} from '@/components/controller'
import {
  DEFAULT_RECTANGLE_ORIGIN_COORDINATES,
  DEFAULT_RECTANGLE_SIZE,
} from '@/constants'
import drawUtils from '@/utils/drawUtils'
import {useEffect, useRef, useState} from 'react'

const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({width: 0, height: 0})
  const [rectangleOriginCoordinates, setRectangleOriginCoordinates] = useState({
    x: 0,
    y: 0,
  })

  const drawRectangle = (originX: number, originY: number) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }

    drawUtils.drawRectangle({
      canvasContext: ctx,
      width: 100,
      height: 100,
      positionX: originX,
      positionY: originY,
    })
  }

  const handleSubmitChanges = (params: TransformationData) => {
    console.log(params)

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }

    const positionX = parseFloat(params.positionX)
    const positionY = parseFloat(params.positionY)
    const rotation = parseFloat(params.rotation)
    const pivotX = parseFloat(params.pivotX)
    const pivotY = parseFloat(params.pivotY)

    if (
      positionX !== rectangleOriginCoordinates.x &&
      positionY !== rectangleOriginCoordinates.y
    ) {
      drawUtils.clearRectangle(
        ctx,
        rectangleOriginCoordinates.x,
        rectangleOriginCoordinates.y,
        DEFAULT_RECTANGLE_SIZE.width,
        DEFAULT_RECTANGLE_SIZE.height,
      )

      ctx.setTransform(1, 0, 0, 1, positionX, -positionY)

      drawRectangle(rectangleOriginCoordinates.x, rectangleOriginCoordinates.y)

      setRectangleOriginCoordinates({
        x: positionX + rectangleOriginCoordinates.x,
        y: positionY + rectangleOriginCoordinates.y,
      })
    }
  }

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) {
        return
      }

      const rect = containerRef.current.getBoundingClientRect()

      setCanvasSize({
        width: rect.width,
        height: rect.height,
      })
    }

    updateCanvasSize()

    const resizeObserver = new ResizeObserver(updateCanvasSize)
    if (!containerRef.current) {
      return
    }

    resizeObserver.observe(containerRef.current)

    window.addEventListener('resize', updateCanvasSize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    drawUtils.drawCoordinateGrid(ctx, {
      width: canvas.width,
      height: canvas.height,
      axisWidth: 2,
      axisColor: 'gray',
      gridSpacing: 50,
      gridWidth: 2,
    })

    drawRectangle(
      DEFAULT_RECTANGLE_ORIGIN_COORDINATES.x,
      DEFAULT_RECTANGLE_ORIGIN_COORDINATES.y,
    )

    setRectangleOriginCoordinates({
      x: DEFAULT_RECTANGLE_ORIGIN_COORDINATES.x,
      y: DEFAULT_RECTANGLE_ORIGIN_COORDINATES.y,
    })
  }, [canvasSize, canvasRef])

  return (
    <div
      id="container"
      className="flex h-screen flex-row items-center justify-center bg-white text-black">
      <div
        id="canvas-container"
        ref={containerRef}
        className="flex flex-1 border-2 border-blue-500"
        style={{height: 'calc(100% - 20px)'}}>
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
        className="flex flex-1 flex-col items-center justify-center border-2 border-red-500">
        <Controller
          onSubmitChanges={handleSubmitChanges}
          rectangleOriginCoordinates={rectangleOriginCoordinates}
          rectangleSize={DEFAULT_RECTANGLE_SIZE}
        />
      </div>
    </div>
  )
}

export default Landing
