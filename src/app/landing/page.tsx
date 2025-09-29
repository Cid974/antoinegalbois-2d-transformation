'use client'
import Controller, {TransformationData} from '@/components/controller'
import {
  DEFAULT_RECTANGLE_ORIGIN_COORDINATES,
  DEFAULT_RECTANGLE_SIZE,
} from '@/constants'
import drawUtils from '@/utils/drawUtils'
import transformUtils from '@/utils/transformUtils'
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

  const drawOrigin = (originX: number, originY: number) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) {
      return
    }

    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2

    const originPositionX = centerX + originX
    const originPositionY = centerY - originY

    drawUtils.drawOrigin(ctx, originPositionX, originPositionY, 'red')
  }

  const handleSubmitChanges = (params: TransformationData) => {
    console.log(params)

    if (!canvasRef.current) {
      return
    }

    const ctx = canvasRef.current?.getContext('2d')

    if (!ctx) {
      return
    }

    const positionX = parseFloat(params.positionX)
    const positionY = parseFloat(params.positionY)
    const rotation = parseFloat(params.rotation)
    const pivotX = parseFloat(params.pivotX)
    const pivotY = parseFloat(params.pivotY)

    drawUtils.drawCoordinateGrid(ctx, {
      width: canvasRef.current.width,
      height: canvasRef.current.height,
      axisWidth: 2,
      axisColor: 'gray',
      gridSpacing: 50,
      gridWidth: 2,
    })

    ctx.save()

    if (pivotX !== 0 || pivotY !== 0) {
      transformUtils.applyCompleteTransformation({
        canvasContext: ctx,
        rectangleOriginCoordinates,
        canvasOriginCoordinates: {
          x: canvasRef.current.width / 2,
          y: canvasRef.current.height / 2,
        },
        translation: {x: positionX, y: positionY},
        rotation,
        pivot: {x: pivotX, y: pivotY},
      })

      drawRectangle(rectangleOriginCoordinates.x, rectangleOriginCoordinates.y)

      const currentRectangleOriginX = rectangleOriginCoordinates.x + positionX
      const currentRectangleOriginY = rectangleOriginCoordinates.y + positionY
      const absolutePivotX = currentRectangleOriginX + pivotX
      const absolutePivotY = currentRectangleOriginY + pivotY
      drawOrigin(absolutePivotX, absolutePivotY)

      ctx.restore()

      setRectangleOriginCoordinates({
        x: positionX + rectangleOriginCoordinates.x,
        y: positionY + rectangleOriginCoordinates.y,
      })

      return
    }

    transformUtils.applyCompleteTransformation({
      canvasContext: ctx,
      rectangleOriginCoordinates,
      canvasOriginCoordinates: {
        x: canvasRef.current.width / 2,
        y: canvasRef.current.height / 2,
      },
      translation: {x: positionX, y: positionY},
      rotation,
    })

    drawRectangle(rectangleOriginCoordinates.x, rectangleOriginCoordinates.y)
    drawOrigin(rectangleOriginCoordinates.x, rectangleOriginCoordinates.y)

    ctx.restore()

    setRectangleOriginCoordinates({
      x: positionX + rectangleOriginCoordinates.x,
      y: positionY + rectangleOriginCoordinates.y,
    })
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

    drawOrigin(
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
        className="flex flex-1"
        style={{height: 'calc(100% - 20px)'}}>
        <canvas
          id="canvas"
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
        />
      </div>
      <div
        id="controls-container"
        className="flex flex-1 flex-col items-center justify-center">
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
