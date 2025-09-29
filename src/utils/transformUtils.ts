interface RotateRectangleParams {
  canvasContext: CanvasRenderingContext2D
  rectangleOriginCoordinates: {x: number; y: number}
  canvasOriginCoordinates: {x: number; y: number}
  rotation: number
}

interface RetrieveRectangleCornersParams {
  rectangleOriginCoordinates: {x: number; y: number}
  rectangleSize: {width: number; height: number}
  rotation: number
}

const rotateRectangle = ({
  canvasContext,
  rectangleOriginCoordinates,
  canvasOriginCoordinates,
  rotation,
}: RotateRectangleParams) => {
  canvasContext.save()

  const angle = -rotation * (Math.PI / 180)

  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  const canvasOriginX = canvasOriginCoordinates.x + rectangleOriginCoordinates.x
  const canvasOriginY = canvasOriginCoordinates.y - rectangleOriginCoordinates.y

  canvasContext.setTransform(
    cos,
    sin,
    -sin,
    cos,
    canvasOriginX - canvasOriginX * cos + canvasOriginY * sin,
    canvasOriginY - canvasOriginX * sin - canvasOriginY * cos,
  )
}

const retrieveRectangleCorners = ({
  rectangleOriginCoordinates,
  rectangleSize,
  rotation,
}: RetrieveRectangleCornersParams) => {
  const originalCorners = [
    {
      x: rectangleOriginCoordinates.x,
      y: rectangleOriginCoordinates.y + rectangleSize.height,
    },
    {
      x: rectangleOriginCoordinates.x + rectangleSize.width,
      y: rectangleOriginCoordinates.y + rectangleSize.height,
    },
    {
      x: rectangleOriginCoordinates.x + rectangleSize.width,
      y: rectangleOriginCoordinates.y,
    },
    {x: rectangleOriginCoordinates.x, y: rectangleOriginCoordinates.y},
  ]

  if (rotation === 0) {
    return originalCorners
  }

  const angle = -rotation * (Math.PI / 180)

  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  const rotationCenterX = rectangleOriginCoordinates.x
  const rotationCenterY = rectangleOriginCoordinates.y

  const rotatedCorners = originalCorners.map(corner => {
    const translatedX = corner.x - rotationCenterX
    const translatedY = corner.y - rotationCenterY

    const rotatedX = translatedX * cos - translatedY * sin
    const rotatedY = translatedX * sin + translatedY * cos

    return {
      x: Math.round((rotatedX + rotationCenterX) * 100) / 100,
      y: Math.round((rotatedY + rotationCenterY) * 100) / 100,
    }
  })

  return rotatedCorners
}

const transformUtils = {
  rotateRectangle,
  retrieveRectangleCorners,
}

export default transformUtils
