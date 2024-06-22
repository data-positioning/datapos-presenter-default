// Dependencies - Vendor
import type { Axis, Chart, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';

// Module Variables
let DependencyWheel: ((highcharts: typeof import('highcharts')) => void) | undefined = undefined;
let Highcharts: typeof import('highcharts') | undefined = undefined; // TODO: Export require for streamgraph example.
let Sankey: ((highcharts: typeof import('highcharts')) => void) | undefined = undefined;
let Streamgraph: ((highcharts: typeof import('highcharts')) => void) | undefined = undefined;

// Facilitators - Build Component Options - Chart, Legend, Series, Subtitle, Title, X Axis & Y Axis - These are the default (base/common) options for each chart component.
export const buildChartOptions = (typeId: string, polar: boolean): ChartOptions => ({
    animation: false,
    backgroundColor: 'transparent',
    polar,
    reflow: false,
    spacing: [30, 30, 30, 30],
    style: { fontSize: '1em' },
    type: typeId
});
export const buildLegendOptions = (): LegendOptions => ({ itemStyle: { fontSize: '0.875rem', fontWeight: '400' }, symbolRadius: 3, verticalAlign: 'top' });
export const buildSubtitleOptions = (title?: string): SubtitleOptions => ({ style: { fontSize: '1rem', fontWeight: '400' }, text: title || undefined });
export const buildTitleOptions = (title?: string): TitleOptions => ({ style: { fontSize: '1rem', fontWeight: '400' }, text: title || undefined });
export const buildXAxisOptions = (categories: string[], title?: string): XAxisOptions => ({
    categories,
    gridLineWidth: 1,
    labels: { style: { fontSize: '0.875rem', fontWeight: '400' } },
    lineColor: undefined,
    title: { style: { fontSize: '0.875rem', fontWeight: '400' }, text: title || undefined }
});
export const buildYAxisOptions = (title?: string): YAxisOptions => ({
    labels: { style: { fontSize: '0.875rem', fontWeight: '400' }, format: '{value:,.0f}' },
    title: { style: { fontSize: '0.875rem', fontWeight: '400' }, text: title || undefined }
});

// Facilitators - Build Series Options - Area, Bar, Column, Line & Radar - These are the default (base/common) options for each chart series.
const buildAreaOptions = (name: string, data: number[], color?: string, useDefaultType: boolean = true): SeriesAreaOptions =>
    ({
        color: color || undefined,
        data,
        name,
        type: useDefaultType ? undefined : 'area'
    }) as SeriesAreaOptions;
const buildBarOptions = (name: string, data: number[], borderColor?: string, color?: string, useDefaultType: boolean = true): SeriesBarOptions =>
    ({
        borderColor: borderColor || undefined,
        color: color || undefined,
        data,
        name,
        type: useDefaultType ? undefined : 'bar'
    }) as SeriesBarOptions;
const buildColumnOptions = (name: string, data: number[], borderColor?: string, color?: string, useDefaultType: boolean = true): SeriesColumnOptions =>
    ({
        borderColor: borderColor || undefined,
        color: color || undefined,
        data,
        name,
        type: useDefaultType ? undefined : 'column'
    }) as SeriesColumnOptions;
const buildLineOptions = (name: string, data: number[], color?: string, useDefaultType: boolean = true): SeriesLineOptions =>
    ({
        color: color || undefined,
        data,
        name,
        type: useDefaultType ? undefined : 'line'
    }) as SeriesLineOptions;

// Facilitators - Render Chart
export const renderChart = async (renderTo: HTMLElement, options: Options, callback?: ChartCallbackFunction): Promise<Chart> => {
    if (!Highcharts) {
        Highcharts = (await import('highcharts')).default;
        const HighchartsMore = (await import('highcharts/highcharts-more')).default;
        HighchartsMore(Highcharts);
        const patternFill = (await import('highcharts/modules/pattern-fill')).default;
        patternFill(Highcharts);
        Highcharts.setOptions({ lang: { thousandsSep: ',' }, plotOptions: { series: { animation: false } } });
    }
    if ((options.chart!.type === 'dependencywheel' && !DependencyWheel) || (options.chart!.type === 'sankey' && !Sankey)) {
        Sankey = (await import('highcharts/modules/sankey')).default;
        Sankey(Highcharts);
        DependencyWheel = (await import('highcharts/modules/dependency-wheel')).default;
        DependencyWheel(Highcharts);
    }
    if (options.chart!.type === 'streamgraph' && !Streamgraph) {
        Streamgraph = (await import('highcharts/modules/streamgraph')).default;
        Streamgraph(Highcharts);
    }
    return new Highcharts.Chart(renderTo, options, callback);
};

// Facilitators - Set Axis Extremes
export const setAxisExtremes = (chart: Chart, axis?: Axis) => {
    const axisExtremes = chart.series.reduce(
        (extremes, series) => {
            extremes.min = Math.min(extremes.min, series.dataMin || 0);
            extremes.max = Math.max(extremes.max, series.dataMax || 0);
            return extremes;
        },
        { min: Infinity, max: -Infinity }
    );

    axis || chart.yAxis[0].setExtremes(axisExtremes.min, axisExtremes.max);
};
