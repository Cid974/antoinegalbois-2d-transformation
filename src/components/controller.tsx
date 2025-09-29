import { match } from "ts-pattern";
import { useMemo, useState } from "react";

type TransformationType = "position" | "pivot";

type Axis = "x" | "y";

export interface OnSubmitChangesParams {
  position?: { x: number; y: number };
  rotation?: number;
  pivot?: { x: number; y: number };
}

interface ControllerProps {
  rectangleOriginCoordinates?: { x: number; y: number };
  rectangleSize?: { width: number; height: number };
  onSubmitChanges: (params: OnSubmitChangesParams) => void;
}

const Controller = ({
  rectangleOriginCoordinates,
  rectangleSize,
  onSubmitChanges,
}: ControllerProps) => {
  const [position, setPosition] = useState({ x: 0.0, y: 0.0 });
  const [rotation, setRotation] = useState(0.0);
  const [pivot, setPivot] = useState({ x: 0.0, y: 0.0 });

  const pointsCoordinates = useMemo(() => {
    if (!rectangleOriginCoordinates || !rectangleSize) {
      return [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ];
    }

    return [
      { x: rectangleOriginCoordinates?.x, y: rectangleOriginCoordinates?.y },
      {
        x: rectangleOriginCoordinates?.x + rectangleSize?.width,
        y: rectangleOriginCoordinates?.y,
      },
      {
        x: rectangleOriginCoordinates?.x + rectangleSize?.width,
        y: rectangleOriginCoordinates?.y + rectangleSize?.height,
      },
      {
        x: rectangleOriginCoordinates?.x,
        y: rectangleOriginCoordinates?.y + rectangleSize?.height,
      },
    ];
  }, [rectangleOriginCoordinates, rectangleSize]);

  const handleCoordinateChange = ({
    axis,
    value,
    transformationType,
  }: {
    axis: Axis;
    value: string;
    transformationType: TransformationType;
  }) => {
    const numValue = parseFloat(value) || 0;
    const roundedValue = Math.round(numValue * 100) / 100;
    if (transformationType === "position") {
      setPosition({
        ...position,
        [axis]: roundedValue,
      });

      return;
    }

    setPivot({
      ...pivot,
      [axis]: roundedValue,
    });
  };

  const handleRotationChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    const roundedValue = Math.round(numValue * 100) / 100;
    setRotation(roundedValue);
  };

  const handleSubmitChanges = () => {
    onSubmitChanges({
      position,
      rotation,
      pivot,
    });
  };

  return (
    <div className="flex flex-col border-2 border-gray-400 rounded-md p-10 gap-4">
      <div>
        <h1>Controller</h1>
        <div className="w-full p-2 border-2 border-gray-300 rounded-md">
          {pointsCoordinates.map((point, index) => (
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
                  return null;
                })}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1>Position</h1>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 items-center">
            <h1>X</h1>
            <input
              type="number"
              step="0.01"
              value={position.x}
              onChange={(e) =>
                handleCoordinateChange({
                  axis: "x",
                  value: e.target.value,
                  transformationType: "position",
                })
              }
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <h1>Y</h1>
            <input
              type="number"
              step="0.01"
              value={position.y}
              onChange={(e) =>
                handleCoordinateChange({
                  axis: "y",
                  value: e.target.value,
                  transformationType: "position",
                })
              }
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      <div>
        <h1>Rotation</h1>
        <input
          type="number"
          step="0.01"
          value={rotation}
          onChange={(e) => handleRotationChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div>
        <h1>Pivot</h1>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 items-center">
            <h1>X</h1>
            <input
              type="number"
              step="0.01"
              value={pivot.x}
              onChange={(e) =>
                handleCoordinateChange({
                  axis: "x",
                  value: e.target.value,
                  transformationType: "pivot",
                })
              }
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <h1>Y</h1>
            <input
              type="number"
              step="0.01"
              value={pivot.y}
              onChange={(e) =>
                handleCoordinateChange({
                  axis: "y",
                  value: e.target.value,
                  transformationType: "pivot",
                })
              }
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="border border-gray-300 w-full py-4 rounded-2xl"
          onClick={handleSubmitChanges}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Controller;
