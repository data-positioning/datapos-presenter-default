// Dependencies - Framework
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { IPresenter, IPresenterConfig, IPresenterItemConfig } from '@datapos/datapos-share-core';
// import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';

// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-expect-error
// import ColumnSeries from 'highcharts/es-modules/Series/Column/ColumnSeries.js';

// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-expect-error
// import LineSeries from 'highcharts/es-modules/Series/Line/LineSeries.js';

// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-expect-error
// import Chart from 'highcharts/es-modules/Core/Chart/Chart.js';
// // eslint-disable-next-line @typescript-eslint/no-unsafe-call

// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-expect-error
// import BarSeries from 'highcharts/es-modules/Series/Bar/BarSeries.js';
// console.log(BarSeries);

// Dependencies - Data
import config from './config.json';

// Interfaces/Types - Module Import
interface ModuleImport {
    default: unknown;
}

// Classes - Default Presentation Set
export default class DefaultPresenter implements IPresenter {
    readonly config: IPresenterConfig;

    constructor() {
        this.config = config as IPresenterConfig;
    }

    list(path: string = ''): IPresenterItemConfig[] {
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
        // // TODO: See: https://www.highcharts.com/docs/getting-started/installation-with-esm for bundling option.
        // const chartUrl = 'https://code.highcharts.com/es-modules/Core/Chart/Chart.js';
        // const Chart = ((await import(chartUrl)) as ModuleImport).default as typeof HighchartsChart;
        // const barUrl = 'https://code.highcharts.com/es-modules/Series/Bar/BarSeries.js';
        // ((await import(barUrl)) as ModuleImport).default as typeof Series;

        // const url = 'https://datapos-plugins.pages.dev/vendor-highcharts.js';
        // const Highcharts = ((await import(url)) as ModuleImport).default;

        // console.log(Highcharts);

        const Highcharts = (await import('highcharts')).default;

        new Highcharts.Chart(renderTo, {
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
