interface CoordinateGridOptions {
  width: number;
  height: number;
  axisWidth: number;
  axisColor: string;
  gridSpacing: number;
  gridWidth?: number;
  showGridLines?: boolean;
} 

interface DrawUnitMarksParams {
  canvasContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  gridSpacing: number;
  axisColor: string;
}

interface DrawAxesParams {
  canvasContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  axisColor: string;
  axisWidth: number;
  gridSpacing: number;
}

interface DrawRectangleParams {
  canvasContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
}

const drawUnitMarks = ({canvasContext, width, height, centerX, centerY, gridSpacing, axisColor}: DrawUnitMarksParams) => {
  const tickLength = 8;
  const fontSize = 12;
  
  canvasContext.strokeStyle = axisColor;
  canvasContext.fillStyle = axisColor;
  canvasContext.lineWidth = 1;
  canvasContext.font = `${fontSize}px Arial`;
  canvasContext.textAlign = 'center';
  canvasContext.textBaseline = 'top';

  for (let x = centerX % gridSpacing; x < width; x += gridSpacing) {
    if (Math.abs(x - centerX) < 1) {
      continue;
    }
    
    canvasContext.beginPath();
    canvasContext.moveTo(x, centerY - tickLength / 2);
    canvasContext.lineTo(x, centerY + tickLength / 2);
    canvasContext.stroke();
    
    const unitValue = Math.round((x - centerX) / gridSpacing);
    canvasContext.fillText(unitValue.toString(), x, centerY + tickLength / 2 + 2);
  }

  canvasContext.textAlign = 'right';
  canvasContext.textBaseline = 'middle';
  
  for (let y = centerY % gridSpacing; y < height; y += gridSpacing) {
    if (Math.abs(y - centerY) < 1) {
      continue;
    }
    
    canvasContext.beginPath();
    canvasContext.moveTo(centerX - tickLength / 2, y);
    canvasContext.lineTo(centerX + tickLength / 2, y);
    canvasContext.stroke();
    
    const unitValue = -Math.round((y - centerY) / gridSpacing);
    canvasContext.fillText(unitValue.toString(), centerX - tickLength / 2 - 2, y);
  }

  canvasContext.textAlign = 'right';
  canvasContext.textBaseline = 'top';
  canvasContext.fillText('0', centerX - 5, centerY + 5);
};

const drawAxes = ({canvasContext, width, height, centerX, centerY, axisColor, axisWidth, gridSpacing}: DrawAxesParams) => {
  canvasContext.strokeStyle = axisColor;
  canvasContext.lineWidth = axisWidth;

  canvasContext.beginPath();
  canvasContext.moveTo(0, centerY);
  canvasContext.lineTo(width, centerY);
  canvasContext.stroke();

  canvasContext.beginPath();
  canvasContext.moveTo(centerX, 0);
  canvasContext.lineTo(centerX, height);
  canvasContext.stroke();

  drawUnitMarks({canvasContext, width, height, centerX, centerY, gridSpacing, axisColor});
};

const drawOrigin = (canvasContext: CanvasRenderingContext2D, centerX: number, centerY: number, axisColor: string) => {
  canvasContext.fillStyle = axisColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, 3, 0, 2 * Math.PI);
  canvasContext.fill();
};


const drawCoordinateGrid = (canvasContext: CanvasRenderingContext2D, options: CoordinateGridOptions) => {
  const { width, height, axisWidth, axisColor, gridSpacing } = options;

  if (!canvasContext) {
    return;
  }

  if (width <= 0 || height <= 0) {
    return;
  }

  const centerX = width / 2;
  const centerY = height / 2;

  canvasContext.clearRect(0, 0, width, height);

  drawAxes({canvasContext, width, height, centerX, centerY, axisColor, axisWidth, gridSpacing});

  drawOrigin(canvasContext, centerX, centerY, axisColor);
};

const drawRectangle = ({canvasContext, width, height, positionX, positionY}: DrawRectangleParams) => {

  const centerX = canvasContext.canvas.width / 2;
  const centerY = canvasContext.canvas.height / 2;

  const canvasX = centerX + positionX;
  const canvasY = centerY - positionY - height;


  canvasContext.strokeStyle = "black";
  canvasContext.lineWidth = 1;
  canvasContext.strokeRect(canvasX, canvasY, width, height);
  
  canvasContext.fillStyle = "lightgray";
  canvasContext.fillRect(canvasX, canvasY, width, height);

  drawOrigin(canvasContext, canvasX, canvasY + height, "red");
}

const clearGridRectangle = (canvasContext: CanvasRenderingContext2D, positionX: number, positionY: number, width: number, height: number) => {

  const centerX = canvasContext.canvas.width / 2;
  const centerY = canvasContext.canvas.height / 2;

  const canvasX = centerX + positionX;
  const canvasY = centerY - positionY - height;

  canvasContext.clearRect(canvasX, canvasY, width, height);
}

const drawUtils = {
  drawCoordinateGrid,
  drawRectangle,
  clearGridRectangle,
};

export default drawUtils;
