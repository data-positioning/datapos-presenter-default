// Dependencies - Vendor.
import type * as HighchartsType from 'highcharts';
import type { Chart, Options, SeriesOptionsType } from 'highcharts';

// Dependencies - Framework.
import type { PresentationView } from '@datapos/datapos-shared';
import { useSampleData } from './useSampleData';
import type { CartesianViewType, PolarViewType, RangeViewType, VisualContentOptions } from '@/index';

// Interfaces/Types - Highcharts view.
export interface HighchartsView extends PresentationView {
    chart: Chart;
}

// Constants
const DOWNLOAD_URL_PREFIX = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/';
const HIGHCHARTS_ID = 'highcharts';

// Module Operations & Variables
let dependencyWheelAndSankeyModulesLoaded = false;
const { getMeasureValues } = useSampleData();
let Highcharts: typeof HighchartsType | undefined = undefined;
let highchartsMoreModuleLoaded = false;
let streamgraphModuleLoaded = false;

// Composables - Use highcharts.
export function useHighcharts() {
    // Operations - Render cartesian chart.
    async function renderCartesianChart(type: CartesianViewType, content: VisualContentOptions, element: HTMLElement, callback?: () => void): Promise<HighchartsView> {
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
        const chart = Highcharts.chart(element, options, callback);
        return { chart, resize: () => chart.reflow(), vendorId: HIGHCHARTS_ID };
    }

    // Operations - Render polar chart.
    async function renderPolarChart(type: PolarViewType, content: VisualContentOptions, element: HTMLElement, callback?: () => void): Promise<HighchartsView> {
        await Promise.all([loadHighchartsCore(), loadHighchartsMoreModule()]);
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
        const chart = Highcharts.chart(element, options, callback);
        return { chart, resize: () => chart.reflow(), vendorId: HIGHCHARTS_ID };
    }

    // Operations - Render range chart.
    async function renderRangeChart(type: RangeViewType, content: VisualContentOptions, element: HTMLElement, callback?: () => void): Promise<HighchartsView> {
        await Promise.all([loadHighchartsCore(), loadHighchartsMoreModule()]);
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
        const chart = Highcharts.chart(element, options, callback);
        return { chart, resize: () => chart.reflow(), vendorId: HIGHCHARTS_ID };
    }

    // Utilities - Load highcharts core.
    async function loadHighchartsCore(): Promise<void> {
        if (Highcharts) return;
        const DOWNLOAD_URL_PREFIX = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/';
        const coreDownloadURL = `${DOWNLOAD_URL_PREFIX}highcharts.src.js`;
        const accessibilityDownloadURL = `${DOWNLOAD_URL_PREFIX}modules/accessibility.src.js`;
        Highcharts = (await import(/* @vite-ignore */ coreDownloadURL)).default;
        await import(/* @vite-ignore */ accessibilityDownloadURL);
    }

    // Utilities - Load highcharts more. TODO: Can be optimised to load all this type requires with required imports being pushed onto promise,all imports.
    async function loadHighchartsMoreModule(): Promise<void> {
        if (highchartsMoreModuleLoaded) return;
        const moreDownloadURL = `${DOWNLOAD_URL_PREFIX}highcharts-more.src.js`;
        await import(/* @vite-ignore */ moreDownloadURL);
        highchartsMoreModuleLoaded = true;
    }

    // Utilities - Load dependency wheel and sankey modules. TODO: Can be optimised to load all this type requires with required imports being pushed onto promise,all imports.
    async function loadDependencyWheelAndSankeyModules(): Promise<void> {
        if (dependencyWheelAndSankeyModulesLoaded) return;
        const dependencyWheelDownloadURL = `${DOWNLOAD_URL_PREFIX}modules/dependency-wheel.src.js`;
        const sankeyDownloadURL = `${DOWNLOAD_URL_PREFIX}modules/sankey.src.js`;
        await Promise.all([import(/* @vite-ignore */ dependencyWheelDownloadURL), import(/* @vite-ignore */ sankeyDownloadURL)]);
        dependencyWheelAndSankeyModulesLoaded = true;
    }

    // Utilities - Load streamgraph module. TODO: Can be optimised to load all this type requires with required imports being pushed onto promise,all imports.
    async function loadStreamgraphModule(): Promise<void> {
        if (streamgraphModuleLoaded) return;
        const streamgraphDownloadURL = `${DOWNLOAD_URL_PREFIX}modules/streamgraph.src.js`;
        await import(/* @vite-ignore */ streamgraphDownloadURL);
        streamgraphModuleLoaded = true;
    }

    // Exposures
    return { renderCartesianChart, renderPolarChart, renderRangeChart };
}
