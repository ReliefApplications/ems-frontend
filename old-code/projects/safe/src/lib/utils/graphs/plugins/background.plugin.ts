import { Plugin } from 'chart.js';

/**
 * Custom plugin for having a white background on the charts
 */
const whiteBackgroundPlugin: Plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: any) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

export default whiteBackgroundPlugin;
