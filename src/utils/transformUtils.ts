interface RotateRectangleParams {
  canvasContext: CanvasRenderingContext2D
  rectangleOriginCoordinates: {x: number; y: number}
  canvasOriginCoordinates: {x: number; y: number}
  rotation: number
}

interface ApplyCompleteTransformationParams {
  canvasContext: CanvasRenderingContext2D
  rectangleOriginCoordinates: {x: number; y: number}
  canvasOriginCoordinates: {x: number; y: number}
  translation: {x: number; y: number}
  rotation: number
  pivot?: {x: number; y: number}
}

interface RetrieveRectangleCornersParams {
  rectangleOriginCoordinates: {x: number; y: number}
  rectangleSize: {width: number; height: number}
  rotation: number
}

const applyCompleteTransformation = ({
  canvasContext,
  rectangleOriginCoordinates,
  canvasOriginCoordinates,
  translation,
  rotation,
  pivot,
}: ApplyCompleteTransformationParams) => {
  const angle = -rotation * (Math.PI / 180)

  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  const canvasOriginX = canvasOriginCoordinates.x
  const canvasOriginY = canvasOriginCoordinates.y

  const rotationOriginX = pivot
    ? canvasOriginX + rectangleOriginCoordinates.x + pivot.x
    : canvasOriginX + rectangleOriginCoordinates.x
  const rotationOriginY = pivot
    ? canvasOriginY - rectangleOriginCoordinates.y - pivot.y
    : canvasOriginY - rectangleOriginCoordinates.y

  const translatedOriginX = translation.x
  const translatedOriginY = -translation.y

  const a = cos
  const b = sin
  const c = -sin
  const d = cos
  const e =
    translatedOriginX +
    rotationOriginX -
    rotationOriginX * cos +
    rotationOriginY * sin
  const f =
    translatedOriginY +
    rotationOriginY -
    rotationOriginX * sin -
    rotationOriginY * cos

  canvasContext.setTransform(a, b, c, d, e, f)
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
  retrieveRectangleCorners,
  applyCompleteTransformation,
}

export default transformUtils
