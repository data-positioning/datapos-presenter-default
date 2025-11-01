// Dependencies - Vendor.
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';

// Dependencies - Framework.
import { VisualContentOptions } from '..';

// Constants
const downloadURLPrefix = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/';

// Module Variables
let Highcharts: typeof import('highcharts') | undefined = undefined;
let highchartsMoreLoaded = false;

// Composables - Use highcharts.
export function useHighcharts() {
    // Operations - Render cartesian chart.
    async function renderCartesianChart(type: { id: 'area' | 'bar' | 'column' | 'line' | 'radar' }, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await loadHighchartsCore();
        const chart = type.id === 'radar' ? { polar: true } : { type: type.id };
        const options: Options = {
            chart,
            plotOptions: { series: { borderColor: '#333' } },
            series: [
                { type: type.id, name: 'Opening', data: [1105, 1110, 1109, 1129, 1129, 1134, 1172, 1173, 1176, 1186, 1189, 1213] },
                { type: type.id, name: 'Closing', data: [1110, 1109, 1129, 1129, 1134, 1172, 1173, 1176, 1186, 1189, 1213, 1211] }
            ],
            title: { text: content.title.text },
            xAxis: { categories: content.data.categoryLabels },
            yAxis: { title: { text: content.data.name } }
        };
        Highcharts.chart(element, options);
    }

    // Operations - Render range chart.
    async function renderRangeChart(type: { id: string }, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await Promise.all([loadHighchartsCore(), loadHighchartsMore()]);

        element.textContent = `${type.id} range chart goes here...`;
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
    return { renderCartesianChart, renderRangeChart };
}
