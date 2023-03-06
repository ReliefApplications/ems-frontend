import { Plugin } from 'chart.js';
import { DEFAULT_FONT_SIZE } from '../parseFontString';

type DrawUnderlinePluginType = {
  display: boolean;
  fontSize: number;
  fontWeight: 'bold' | 'normal';
  fontStyle: 'italic' | 'normal';
  color: string;
};

/** Plugin for underling chart title */
const drawUnderlinePlugin: Plugin = {
  id: 'underline',
  afterDatasetsDraw: (chart: any, _: any, opt: DrawUnderlinePluginType) => {
    if (!opt.display || !chart?.titleBlock) return;
    const { ctx } = chart;
    const text: string | undefined = chart.titleBlock.options?.text;
    let padding: number | undefined = chart.titleBlock.options?.padding;
    if (!text || !padding) return;

    // brings line close to text
    padding += opt.fontSize / 6;

    ctx.save();
    ctx.font = `${opt.fontWeight === 'bold' ? 'bold' : ''} ${
      opt.fontStyle === 'italic' ? 'italic' : ''
    } ${opt.fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    const titleWidth = ctx.measureText(text).width;
    const { bottom, width } = chart.titleBlock;
    const start = (width - titleWidth) / 2;
    ctx.strokeStyle = opt.color || 'black';
    ctx.lineWidth = opt.fontWeight === 'bold' ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(start, bottom - padding);
    ctx.lineTo(start + titleWidth, bottom - padding);
    ctx.stroke();
    ctx.restore();
  },
  defaults: {
    display: false,
    fontSize: DEFAULT_FONT_SIZE,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: 'black',
  },
};

export default drawUnderlinePlugin;
