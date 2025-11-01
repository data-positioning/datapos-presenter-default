// Dependencies - Vendor.
import type * as HighchartsType from 'highcharts';
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SeriesOptionsType, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesColumnrangeOptions, SeriesLineOptions } from 'highcharts';

// Dependencies - Framework.
import { useSampleData } from './useSampleData';
import type { CartesianType, PolarType, RangeType, VisualContentOptions } from '@/index';

// Constants
const downloadURLPrefix = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/';

// Module Variables
let Highcharts: typeof HighchartsType | undefined = undefined;
let highchartsMoreLoaded = false;

const { getMeasureValues } = useSampleData();

// Composables - Use highcharts.
export function useHighcharts() {
    // Operations - Render cartesian chart.
    async function renderCartesianChart(type: CartesianType, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await loadHighchartsCore();
        const series: SeriesOptionsType[] = [];
        for (const measure of content.data.measures) {
            series.push({ type: type.options.highchartsType, name: measure.name, data: getMeasureValues([measure.id]) });
        }
        const options: Options = {
            chart: { type: type.options.highchartsType },
            plotOptions: { series: { borderColor: '#333' } },
            series,
            title: { text: content.title.text },
            xAxis: { categories: content.data.categoryLabels },
            yAxis: { title: { text: content.data.name } }
        };
        Highcharts.chart(element, options);
    }
    // Operations - Render polar chart.
    async function renderPolarChart(type: PolarType, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await Promise.all([loadHighchartsCore(), loadHighchartsMore()]);
        const series: SeriesOptionsType[] = [];
        for (const measure of content.data.measures) {
            series.push({ type: type.options.highchartsType, name: measure.name, data: getMeasureValues([measure.id]) });
        }
        const options: Options = {
            chart: { polar: true },
            plotOptions: { series: { borderColor: '#333' } },
            series,
            title: { text: content.title.text },
            xAxis: { categories: content.data.categoryLabels },
            yAxis: { title: { text: content.data.name } }
        };
        Highcharts.chart(element, options);
    }

    // Operations - Render range chart.
    async function renderRangeChart(type: RangeType, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await Promise.all([loadHighchartsCore(), loadHighchartsMore()]);
        const series: SeriesOptionsType[] = [];
        series.push({ type: type.options.highchartsType, name: 'Unknown', data: getMeasureValues([content.data.measures[0].id, content.data.measures[1].id]) });
        const options: Options = {
            chart: { type: type.options.highchartsType, inverted: type.options.inverted },
            plotOptions: { series: { borderColor: '#333' } },
            series,
            title: { text: content.title.text },
            xAxis: { categories: content.data.categoryLabels },
            yAxis: { title: { text: content.data.name } }
        };
        Highcharts.chart(element, options);
    }

    // Utilities - Load highcharts core.
    async function loadHighchartsCore(): Promise<void> {
        if (Highcharts) return;
        const downloadURLPrefix = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/';
        const coreDownloadURL = `${downloadURLPrefix}highcharts.src.js`;
        const accessibilityDownloadURL = `${downloadURLPrefix}modules/accessibility.src.js`;
        Highcharts = (await import(/* @vite-ignore */ coreDownloadURL)).default;
        await import(/* @vite-ignore */ accessibilityDownloadURL);
    }

    // Utilities - Load highcharts more.
    async function loadHighchartsMore(): Promise<void> {
        if (highchartsMoreLoaded) return;
        const moreDownloadURL = `${downloadURLPrefix}highcharts-more.src.js`;
        await import(/* @vite-ignore */ moreDownloadURL);
        highchartsMoreLoaded = true;
    }

    // Exposures
    return { renderCartesianChart, renderPolarChart, renderRangeChart };
}
