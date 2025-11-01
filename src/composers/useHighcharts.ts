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
    async function renderCartesianChart(type: { id: string }, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await loadHighchartsCore();

        // for (const series of options.series) {
        //     (series as SeriesLineOptions).data = this.sampleData.getMeasureValues(series.measureId);
        // }
        // element.textContent = '';
        // Highcharts.chart(element, options);

        element.textContent = `${type.id} cartesian chart goes here...`;
    }

    // Operations - Render range chart.
    async function renderRangeChart(type: { id: string }, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await Promise.all([loadHighchartsCore(), loadHighchartsMore()]);

        // for (const series of options.series) {
        //     (series as SeriesLineOptions).data = this.sampleData.getMeasureValues(series.measureId);
        // }
        // element.textContent = '';
        // Highcharts.chart(element, options);

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
