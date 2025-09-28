import { match } from "ts-pattern";
import { useState } from "react";

export const Controller = () => {
  const pointsCoordinates = [
    { x: 100, y: 100 },
    { x: 200, y: 200 },
    { x: 300, y: 300 },
    { x: 400, y: 400 },
  ];

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [pivot, setPivot] = useState({ x: 0, y: 0 });

  const handleInputChange = (axis: "x" | "y", value: string) => {
    // Allow empty string, numbers, and decimal points
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setPosition((prev) => ({
        ...prev,
        [axis]: value === "" ? 0 : parseFloat(value) || 0,
      }));
    }
  };

  const handleRotationChange = (value: string) => {
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setRotation(value === "" ? 0 : parseFloat(value) || 0);
    }
  };

  const handlePivotChange = (axis: "x" | "y", value: string) => {
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setPivot((prev) => ({
        ...prev,
        [axis]: value === "" ? 0 : parseFloat(value) || 0,
      }));
    }
  };

  const formatValue = (value: number): string => {
    return value.toFixed(2);
  };

  return (
    <div className="flex flex-col border-2 border-gray-400 rounded-md p-10 gap-4">
      <div>
        <h1>Controller</h1>
        <div>
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
              type="text"
              value={formatValue(position.x)}
              onChange={(e) => handleInputChange("x", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <h1>Y</h1>
            <input
              type="text"
              value={formatValue(position.y)}
              onChange={(e) => handleInputChange("y", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      <div>
        <h1>Rotation</h1>
        <input
          type="text"
          value={formatValue(rotation)}
          onChange={(e) => handleRotationChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
          placeholder="0.00"
        />
      </div>
      <div>
        <h1>Pivot</h1>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 items-center">
            <h1>X</h1>
            <input
              type="text"
              value={formatValue(pivot.x)}
              onChange={(e) => handlePivotChange("x", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <h1>Y</h1>
            <input
              type="text"
              value={formatValue(pivot.y)}
              onChange={(e) => handlePivotChange("y", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
