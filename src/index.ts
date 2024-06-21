// Dependencies - Framework
import type { Axis, Chart, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { IPresentor, IPresentorConfig, IPresentorItemConfig } from '@datapos/datapos-share-core';
import type { SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions, Series } from 'highcharts';

// Dependencies - Data
import config from './config.json';

// Classes - Default Presentation Set
export default class DefaultPresentor implements IPresentor {
    readonly config: IPresentorConfig;

    constructor() {
        this.config = config as IPresentorConfig;
    }

    list(path: string = ''): IPresentorItemConfig[] {
        const pathSegments = path.split('/');
        let items = this.config.index;
        for (let segmentIndex = 1; segmentIndex < pathSegments.length; segmentIndex++) {
            const childItem = items.find((item) => item.name === pathSegments[segmentIndex]);
            if (childItem && childItem.typeId === 'folder') {
                items = childItem.items || [];
            } else {
                return []; // Path is invalid.
            }
        }
        return items;
    }

    async render(id: string, renderTo: string | HTMLElement): Promise<void> {
        // const url = `https://firebasestorage.googleapis.com/v0/b/datapos-prod.appspot.com/o/connectors%2Fhighcharts-Dl4Gk9bH.js?alt=media`;
        const chartUrl = 'https://code.highcharts.com/es-modules/Core/Chart/Chart.js';
        const MyChart = ((await import(chartUrl)) as { default: unknown }).default as Chart;
        const barUrl = 'https://code.highcharts.com/es-modules/Series/Bar/BarSeries.js';
        const BarSeries = ((await import(barUrl)) as { default: unknown }).default as Series;

        console.log(MyChart);
        console.log(BarSeries);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        new MyChart(renderTo, {
            chart: { type: 'bar' },
            title: { text: 'Fruit Consumption' },
            xAxis: { categories: ['Apples', 'Bananas', 'Oranges'] },
            yAxis: { title: { text: 'Fruit eaten' } },
            series: [
                { name: 'Jane', data: [1, 0, 4] },
                { name: 'John', data: [5, 7, 3] }
            ]
        } as Options);
    }
}
