// Dependencies - Vendor.
import type * as HighchartsType from 'highcharts';
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SeriesOptionsType, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesColumnrangeOptions, SeriesLineOptions } from 'highcharts';

// Dependencies - Framework.
import { useSampleData } from './useSampleData';
import type { ViewType, VisualContentOptions } from '@/index';

// Constants
const downloadURLPrefix = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/';

// Module Variables
let Highcharts: typeof HighchartsType | undefined = undefined;
let highchartsMoreLoaded = false;

const { getMeasureValues } = useSampleData();

// Composables - Use highcharts.
export function useHighcharts() {
    // Operations - Render cartesian chart.
    async function renderCartesianChart(type: { id: 'area' | 'bar' | 'column' | 'line' }, viewType: ViewType, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await loadHighchartsCore();
        const series: SeriesOptionsType[] = [];
        for (const measure of content.data.measures) {
            series.push({ type: type.id, name: measure.name, data: getMeasureValues([measure.id]) });
        }
        const options: Options = {
            chart: { type: viewType.options.type },
            plotOptions: { series: { borderColor: '#333' } },
            series,
            title: { text: content.title.text },
            xAxis: { categories: content.data.categoryLabels },
            yAxis: { title: { text: content.data.name } }
        };
        Highcharts.chart(element, options);
    }
    // Operations - Render polar chart.
    async function renderPolarChart(type: { id: 'area' | 'column' | 'line' }, viewType: ViewType, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await Promise.all([loadHighchartsCore(), loadHighchartsMore()]);
        const series: SeriesOptionsType[] = [];
        for (const measure of content.data.measures) {
            series.push({ type: type.id, name: measure.name, data: getMeasureValues([measure.id]) });
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
    async function renderRangeChart(type: { id: string }, viewType: ViewType, content: VisualContentOptions, element: HTMLElement): Promise<void> {
        await Promise.all([loadHighchartsCore(), loadHighchartsMore()]);
        const series: SeriesOptionsType[] = [];
        series.push({ type: 'columnrange', name: 'Unknown', data: getMeasureValues([content.data.measures[0].id, content.data.measures[1].id]) });
        const options: Options = {
            chart: { type: 'columnrange', inverted: viewType.options.inverted },
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

/*
```json
{
    "chart": { "type": "columnrange" },
    "accessibility": { "description": "Image description: A column range chart compares the... " },
    "title": { "text": "Temperature variation by month" },
    "subtitle": {
        "text": "Observed in Vik i Sogn, Norway, 2023 |  Source: <a href='https://www.vikjavev.no/ver/' target='_blank'>Vikjavev</a>"
    },
    "xAxis": {
        "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    "yAxis": {
        "title": { "text": "Temperature ( °C )" }
    },
    "tooltip": { "valueSuffix": "°C" },
    "plotOptions": {
        "columnrange": { "borderRadius": "50%", "dataLabels": { "enabled": true, "format": "{y}°C" } }
    },
    "legend": {
        "enabled": false
    },
    "series": [
        {
            "name": "Temperatures",
            "data": [
                [-9.5, 8.0],
                [-7.8, 8.3],
                [-13.1, 9.2],
                [-4.4, 15.7],
                [-1.0, 20.8],
                [3.1, 28.4],
                [8.9, 27.0],
                [9.6, 23.0],
                [4.9, 19.3],
                [-5.2, 11.6],
                [-10.5, 12.0],
                [-12.1, 8.5]
            ]
        }
    ]
}
```
*/
