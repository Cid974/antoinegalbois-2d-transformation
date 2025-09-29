import {match} from 'ts-pattern'
import {useCallback, useEffect, useMemo, useState} from 'react'
import z from 'zod'
import {transformationSchema} from '@/schema/transformationSchema'
import transformUtils from '@/utils/transformUtils'

export type TransformationData = z.infer<typeof transformationSchema>

interface ValidationErrors {
  positionX?: string
  positionY?: string
  rotation?: string
  pivotX?: string
  pivotY?: string
}

interface ControllerProps {
  rectangleOriginCoordinates?: {x: number; y: number}
  rectangleSize?: {width: number; height: number}
  onSubmitChanges: (params: TransformationData) => void
}

const Controller = ({
  rectangleOriginCoordinates,
  rectangleSize,
  onSubmitChanges,
}: ControllerProps) => {
  const [formData, setFormData] = useState<TransformationData>({
    positionX: '',
    positionY: '',
    rotation: '0',
    pivotX: '',
    pivotY: '',
  })

  const [rectangleCorners, setRectangleCorners] = useState<
    {x: number; y: number}[]
  >([
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
  ])

  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const updateRectangleCorners = useCallback(
    (rotation: number) => {
      if (!rectangleOriginCoordinates || !rectangleSize) {
        return
      }

      const rectangleCorners = transformUtils.retrieveRectangleCorners({
        rectangleOriginCoordinates,
        rectangleSize,
        rotation: rotation,
      })

      setRectangleCorners(rectangleCorners)
    },
    [rectangleOriginCoordinates, rectangleSize],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = transformationSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: ValidationErrors = {}

      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof ValidationErrors
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
    } else {
      // Form is valid
      setErrors({})

      const transformedData = {
        positionX: result.data.positionX
          ? parseFloat(result.data.positionX)
          : '0',
        positionY: result.data.positionY
          ? parseFloat(result.data.positionY)
          : '0',
        rotation: result.data.rotation ? parseFloat(result.data.rotation) : '0',
        pivotX: result.data.pivotX ? parseFloat(result.data.pivotX) : '0',
        pivotY: result.data.pivotY ? parseFloat(result.data.pivotY) : '0',
      }

      updateRectangleCorners(
        result.data.rotation ? parseFloat(result.data.rotation) : 0,
      )

      onSubmitChanges(transformedData as TransformationData)
    }
  }

  useEffect(() => {
    updateRectangleCorners(0)
  }, [updateRectangleCorners])

  return (
    <div className="flex flex-col gap-4 rounded-md border-2 border-gray-400 p-10">
      <div>
        <h1>Controller</h1>
        <div className="w-full rounded-md border-2 border-gray-300 p-2">
          {rectangleCorners.map((point, index) => (
            <div key={index}>
              {match(index)
                .with(0, () => (
                  <p>
                    {index + 1}. Left-Top: {point.x}, {point.y}
                  </p>
                ))
                .with(1, () => (
                  <p>
                    {index + 1}. Right-Top: {point.x}, {point.y}
                  </p>
                ))
                .with(2, () => (
                  <p>
                    {index + 1}. Right-Bottom: {point.x}, {point.y}
                  </p>
                ))
                .with(3, () => (
                  <p>
                    {index + 1}. Left-Bottom: {point.x}, {point.y}
                  </p>
                ))
                .otherwise(() => {
                  return null
                })}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1>Position</h1>
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <h1>X</h1>
              <input
                type="text"
                id="positionX"
                name="positionX"
                value={formData.positionX}
                onChange={handleChange}
                placeholder="e.g., 10, 10.5, or -5.25"
                className={`w-full rounded px-3 py-2 ${
                  errors.positionX
                    ? 'border-2 border-red-500'
                    : 'border border-gray-300'
                }`}
              />
            </div>
            {errors.positionX && (
              <span className="text-xs text-red-500">{errors.positionX}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <h1>Y</h1>
              <input
                type="text"
                id="positionY"
                name="positionY"
                value={formData.positionY}
                onChange={handleChange}
                placeholder="e.g., 20, 20.5, or -15.75"
                className={`w-full rounded px-3 py-2 ${
                  errors.positionY
                    ? 'border-2 border-red-500'
                    : 'border border-gray-300'
                }`}
              />
            </div>
            {errors.positionY && (
              <span className="text-xs text-red-500">{errors.positionY}</span>
            )}
          </div>
        </div>
      </div>
      <div>
        <h1>Rotation</h1>
        <input
          type="text"
          id="rotation"
          name="rotation"
          value={formData.rotation}
          onChange={handleChange}
          placeholder="e.g., 45, 45.5, or -90.5"
          className={`w-full rounded px-3 py-2 ${
            errors.rotation
              ? 'border-2 border-red-500'
              : 'border border-gray-300'
          }`}
        />
        {errors.rotation && (
          <span className="text-xs text-red-500">{errors.rotation}</span>
        )}
      </div>
      <div>
        <h1>Pivot</h1>
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <h1>X</h1>
              <input
                type="text"
                id="pivotX"
                name="pivotX"
                value={formData.pivotX}
                onChange={handleChange}
                placeholder="e.g., 10, 10.5, or -5.25"
                className={`w-full rounded px-3 py-2 ${
                  errors.pivotX
                    ? 'border-2 border-red-500'
                    : 'border border-gray-300'
                }`}
              />
            </div>
            {errors.pivotX && (
              <span className="text-xs text-red-500">{errors.pivotX}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <h1>Y</h1>
              <input
                type="text"
                id="pivotY"
                name="pivotY"
                value={formData.pivotY}
                onChange={handleChange}
                placeholder="e.g., 20, 20.5, or -15.75"
                className={`w-full rounded px-3 py-2 ${
                  errors.pivotY
                    ? 'border-2 border-red-500'
                    : 'border border-gray-300'
                }`}
              />
            </div>
            {errors.pivotY && (
              <span className="text-xs text-red-500">{errors.pivotY}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="w-full rounded-2xl border border-gray-300 py-4"
          onClick={handleSubmit}>
          Apply
        </button>
      </div>
    </div>
  )
}

export default Controller
