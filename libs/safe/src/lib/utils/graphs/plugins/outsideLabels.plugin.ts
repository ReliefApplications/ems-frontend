import { Plugin } from 'chart.js';

/**
 * Basic interface for a point
 */
interface Point {
  x: number;
  y: number;
}

type DrawOutsideLabelsPluginType = {
  display: boolean;
};

/**
 * Gets a suitable Y coordinate for a label based on existing label coordinates and label direction
 *
 * @param {number} y - The Y coordinate to be checked and adjusted if necessary
 * @param {number[]} yArray - An array of existing Y coordinates of labels
 * @param {'left' | 'right'} direction - The direction of the label relative to the chart center
 * @returns {number} - A suitable Y coordinate for the label
 */
const getSuitableY = (
  y: number,
  yArray: number[] = [],
  direction: 'left' | 'right'
): number => {
  let result = y;
  yArray.forEach((existedY) => {
    if (existedY - 14 < result && existedY + 14 > result) {
      if (direction === 'right') {
        result = existedY + 14;
      } else {
        result = existedY - 14;
      }
    }
  });
  return result;
};

/**
 * Calculates the origin point of a line from a source point to a center point at a given length
 *
 * @param {Point} source - The source point of the line
 * @param {Point} center - The center point of the chart
 * @param {number} radius - the outer radius of the chart
 * @returns {Point} - The origin point of the line
 */
const getOriginPoints = (
  source: Point,
  center: Point,
  radius: number
): Point => {
  const a = {
    x: 0,
    y: 0,
  };
  const dx = center.x - source.x;
  const dy = center.y - source.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const outerRadius = radius - distance;
  const ratio = outerRadius / distance;
  a.x = center.x + dx * ratio;
  a.y = center.y + dy * ratio;
  return a;
};

/**
 * A plugin to draw outside labels for a chart's data points
 */
const outsideLabelsPlugin: Plugin = {
  id: 'customOutsideDataLabels',
  afterDraw: (chart: any, _: any, opt: DrawOutsideLabelsPluginType) => {
    if (!opt.display) return;
    const ctx = chart.ctx;
    ctx.save();
    const leftLabelCoordinates: number[] = [];
    const rightLabelCoordinates: number[] = [];
    const chartCenterPoint = {
      x:
        (chart.chartArea.right - chart.chartArea.left) / 2 +
        chart.chartArea.left,
      y:
        (chart.chartArea.bottom - chart.chartArea.top) / 2 +
        chart.chartArea.top,
    };
    chart.config.data.labels.forEach((label: any, i: any) => {
      const meta = chart.getDatasetMeta(0);
      const arc = meta.data[i];
      // Prepare data to draw
      const centerPoint = arc.getCenterPoint();
      const color = chart.config._config.data.datasets[0].backgroundColor[i]
        ? chart.config._config.data.datasets[0].backgroundColor[i]
        : null; //does not work as palette seems undefined
      const angle = Math.atan2(
        centerPoint.y - chartCenterPoint.y,
        centerPoint.x - chartCenterPoint.x
      );
      const originPoint = getOriginPoints(
        chartCenterPoint,
        centerPoint,
        arc.outerRadius
      );
      const point2X =
        chartCenterPoint.x +
        Math.cos(angle) *
          (centerPoint.x < chartCenterPoint.x
            ? arc.outerRadius + 10
            : arc.outerRadius + 10);
      let point2Y =
        chartCenterPoint.y +
        Math.sin(angle) *
          (centerPoint.y < chartCenterPoint.y
            ? arc.outerRadius + 15
            : arc.outerRadius + 15);

      let suitableY;
      if (point2X < chartCenterPoint.x) {
        suitableY = getSuitableY(point2Y, leftLabelCoordinates, 'left');
      } else {
        suitableY = getSuitableY(point2Y, rightLabelCoordinates, 'right');
      }

      point2Y = suitableY;

      const value = label;
      const edgePointX =
        point2X < chartCenterPoint.x
          ? chartCenterPoint.x - arc.outerRadius - 10
          : chartCenterPoint.x + arc.outerRadius + 10;

      if (point2X < chartCenterPoint.x) {
        leftLabelCoordinates.push(point2Y);
      } else {
        rightLabelCoordinates.push(point2Y);
      }

      //DRAW CODE
      // first line: connect between arc's center point and outside point
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(originPoint.x, originPoint.y);
      ctx.lineTo(point2X, point2Y);
      ctx.stroke();
      // second line: connect between outside point and chart's edge
      ctx.beginPath();
      ctx.moveTo(point2X, point2Y);
      ctx.lineTo(edgePointX, point2Y);
      ctx.stroke();
      //fill custom label
      const labelAlignStyle =
        edgePointX < chartCenterPoint.x ? 'right' : 'left';
      const labelX =
        edgePointX < chartCenterPoint.x ? edgePointX : edgePointX + 0;
      const labelY = point2Y + 7;
      ctx.textAlign = labelAlignStyle;
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold';
      ctx.fillText(value, labelX, labelY);
    });
    ctx.restore();
  },
};

export default outsideLabelsPlugin;
