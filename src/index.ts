// Dependencies - Framework
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { IPresenter, IPresenterConfig, IPresenterItemConfig } from '@datapos/datapos-share-core';
// import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';

// Dependencies - Data
import config from './config.json';

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
        const Highcharts = (await import('highcharts')).default;

        new Highcharts.Chart(renderTo, {
            chart: { type: 'bar' },
            title: { text: 'Fruit Consumption 2' },
            xAxis: { categories: ['Apples', 'Bananas', 'Oranges'] },
            yAxis: { title: { text: 'Fruit eaten' } },
            series: [
                { name: 'Jane', data: [1, 0, 4] },
                { name: 'John', data: [5, 7, 3] }
            ]
        } as Options);
    }
}
