import type { Chart, ChartCallbackFunction, Options } from 'highcharts';

import { type ColorConfig, Colors, Patterns, type View } from './viewHelpers';

export interface HighchartsView extends View {
    chart: Chart;
}

let DependencyWheel: ((highcharts: typeof import('highcharts')) => void) | undefined = undefined;
export let Highcharts: typeof import('highcharts') | undefined = undefined; // TODO: Export require for streamgraph example.
let Sankey: ((highcharts: typeof import('highcharts')) => void) | undefined = undefined;
let Streamgraph: ((highcharts: typeof import('highcharts')) => void) | undefined = undefined;

export const buildDefaultChart = (type: string) => ({ type, backgroundColor: 'transparent', reflow: false, spacing: [30, 2, 30, 2] });

export const buildDefaultChartSubTitle = (text: string) => ({ style: { 'font-size': '1rem', 'font-weight': '400' }, text: text });

export const buildDefaultChartTitle = (text: string) => ({ style: { 'font-size': '1rem', 'font-weight': '400' }, text: text });

export const buildDefaultLegend = () => ({ verticalAlign: 'top' });

export const buildDefaultColumnChartLegend = () => ({ ...buildDefaultLegend(), symbolRadius: 0 });

export const buildDefaultSeries = (name: string, colorConfig: ColorConfig, data?: number[]) => ({
    borderColor: colorConfig.border,
    color: colorConfig.fillTranslucent,
    data,
    name
});

export const buildDefaultXAxis = (categories: string[], text?: string) => ({ categories, gridLineWidth: 1, /*lineColor: undefined,*/ title: { text } });

export const buildDefaultYAxis = (text?: string) => ({ labels: { format: '{value:,.0f}' }, title: { text } });

export const buildAreaBaseRange = (low: number, high: number) => (high < low ? high : low);

export const buildAreaDeclineRange = (low: number, high: number) => (high < low ? low - high : 0);

export const buildAreaIncreaseRange = (low: number, high: number) => (high < low ? 0 : high - low);

export const buildBarRange = (low: number, high: number, patternIndex?: number) => {
    let borderColor: string;
    let fillOpaqueColor: string;
    let fillTranslucentColor: string;
    if (high < low) {
        borderColor = Colors.negative.border;
        fillOpaqueColor = 'white';
        fillTranslucentColor = Colors.negative.fillTranslucent;
    } else {
        borderColor = Colors.positive.border;
        fillOpaqueColor = 'white';
        fillTranslucentColor = Colors.positive.fillTranslucent;
    }
    return {
        borderColor,
        color: patternIndex === undefined ? fillTranslucentColor : { pattern: { ...Patterns[patternIndex], color: borderColor, backgroundColor: fillOpaqueColor } },
        fillTranslucentColor,
        low,
        high
    };
};

export const render = async (renderTo: HTMLElement, options: Options, callback?: ChartCallbackFunction): Promise<HighchartsView> => {
    if (!Highcharts) {
        Highcharts = (await import('highcharts')).default;
        const HighchartsMore = (await import('highcharts/highcharts-more')).default;
        HighchartsMore(Highcharts);
        const patternFill = (await import('highcharts/modules/pattern-fill')).default;
        patternFill(Highcharts);
        Highcharts.setOptions({ lang: { thousandsSep: ',' }, plotOptions: { series: { animation: true } } });
    }
    if ((options.chart.type === 'dependencywheel' && !DependencyWheel) || (options.chart.type === 'sankey' && !Sankey)) {
        Sankey = (await import('highcharts/modules/sankey')).default;
        Sankey(Highcharts);
        DependencyWheel = (await import('highcharts/modules/dependency-wheel')).default;
        DependencyWheel(Highcharts);
    }
    if (options.chart.type === 'streamgraph' && !Streamgraph) {
        Streamgraph = (await import('highcharts/modules/streamgraph')).default;
        Streamgraph(Highcharts);
    }
    const chart = new Highcharts.Chart(renderTo, options, callback);
    return { chart, resize: () => chart.reflow(), vendorId: 'highcharts' };
};

export function renderRangeConnectors(context: any, isMounted: boolean, seriesIndex: number) {
    for (const connectorLine of context.container.querySelectorAll('path.datapos-connector-line')) connectorLine.remove();

    const plotBox = context.plotBox;
    const points = context.series[seriesIndex].points;
    for (let index = 0; index < points.length - 1; index++) {
        const point = points[index];
        const nextPoint = points[index + 1];
        const width = nextPoint.shapeArgs.x - (point.shapeArgs.x + point.shapeArgs.width);
        const shapeArgs = point.shapeArgs;
        const xPoint = plotBox.x + shapeArgs.x + shapeArgs.width;
        const yPoint = point.high < point.low ? plotBox.y + shapeArgs.y + shapeArgs.height : plotBox.y + shapeArgs.y;
        context.renderer
            .path(['M', xPoint, yPoint, 'L', xPoint + width, yPoint])
            .attr({ 'stroke-width': 1, stroke: isMounted ? Colors.darkGrey.border : 'transparent', dashstyle: 'solid', zIndex: 100, class: 'datapos-connector-line' })
            .add();
    }
}

export const showRangeConnectors = (element: HTMLElement) => {
    for (const connectorLine of element.querySelectorAll('path.datapos-connector-line')) connectorLine.setAttribute('style', `stroke: ${Colors.darkGrey.border}`);
};
