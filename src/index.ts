// Dependencies - Framework
import type {
    Axis,
    Chart as HighchartsChart,
    ChartCallbackFunction,
    ChartOptions,
    LegendOptions,
    Options,
    SubtitleOptions,
    TitleOptions,
    XAxisOptions,
    YAxisOptions
} from 'highcharts';
import type { IPresentor, IPresentorConfig, IPresentorItemConfig } from '@datapos/datapos-share-core';
import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';

// Dependencies - Data
import config from './config.json';

// Interfaces/Types - Module Import
interface ModuleImport {
    default: unknown;
}

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
        const chartUrl = 'https://code.highcharts.com/es-modules/Core/Chart/Chart.js';
        const Chart = ((await import(chartUrl)) as ModuleImport).default as typeof HighchartsChart;
        const barUrl = 'https://code.highcharts.com/es-modules/Series/Bar/BarSeries.js';
        ((await import(barUrl)) as ModuleImport).default as typeof Series;

        new Chart(renderTo, {
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
