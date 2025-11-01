// Dependencies - Vendor.
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';

// Dependencies - Framework.
import { useSampleData } from './sampleData/useSampleData';
import type { Presenter, PresenterConfig, PresenterItemConfig, PresenterLocalisedConfig, PresenterTools } from '@datapos/datapos-shared';

// Dependencies - Data.
import config from '../config.json';
import configPresentations from '../configPresentations.json';

// Classes - Default Presenter
export default class DefaultPresenter implements Presenter {
    readonly config: PresenterConfig;
    readonly sampleData;
    readonly tools: PresenterTools;

    constructor(tools: PresenterTools) {
        this.config = config as PresenterConfig;
        this.tools = tools;
        this.sampleData = useSampleData();
    }

    getIndex(): PresenterItemConfig[] {
        // @ts-expect-error
        return this.config.presentations;
    }

    list(path: string = ''): PresenterItemConfig[] {
        const pathSegments = path.split('/');
        // @ts-expect-error
        let items = this.config.presentations;
        for (let segmentIndex = 1; segmentIndex < pathSegments.length; segmentIndex++) {
            // @ts-expect-error
            const childItem = items.find((item) => item.name === pathSegments[segmentIndex]);
            if (childItem && childItem.typeId === 'folder') {
                items = childItem.items || [];
            } else {
                return []; // Path is invalid.
            }
        }
        return items;
    }

    async render(presentationPath: keyof typeof configPresentations, renderTo: HTMLElement): Promise<void> {
        const presentation = configPresentations[presentationPath];

        // Substitute arguments in content.
        const processedMarkdown = presentation.content.replace(/\{\{(\w+)\}\}/g, (_, key: keyof typeof presentation.attributes) => {
            switch (key) {
                case 'label':
                    return presentation.attributes[key].en ?? `{{${key}}}`;
                case 'description':
                    return presentation.attributes[key].en ?? `{{${key}}}`;
                default:
                    return String(presentation.attributes[key]) ?? `{{${key}}}`;
            }
        });

        // Construct markdown parser.
        const markdownParser = new this.tools.markdownIt();
        markdownParser.renderer.rules.fence = (tokens, index) => {
            const token = tokens[index];
            const infoSegments = token.info.split(' ');
            const langName = infoSegments[0]?.trim() ?? undefined;
            const typeId = infoSegments[1]?.trim() ?? undefined;
            const content = token.content;
            switch (typeId) {
                case 'datapos-highcharts-chart': {
                    // const dataId = `${typeId}-${Math.random().toString(36).slice(2)}`;
                    return `<div class="${typeId}" data-options="${encodeURIComponent(content)}"></div>`;
                }
                default:
                    return `<pre><code class="language-${langName}">${content}</code></pre>`;
            }
        };

        // Render html from markdown and inset into  placeholder element.
        const html = markdownParser.render(processedMarkdown);
        renderTo.innerHTML = html;

        const downloadURLPrefix = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/';
        const coreDownloadURL = `${downloadURLPrefix}highcharts.src.js`;
        const accessibilityDownloadURL = `${downloadURLPrefix}modules/accessibility.src.js`;
        const moreDownloadURL = `${downloadURLPrefix}highcharts-more.src.js`;
        const Highcharts = (await import(/* @vite-ignore */ coreDownloadURL)).default;
        await import(/* @vite-ignore */ accessibilityDownloadURL);
        await import(/* @vite-ignore */ moreDownloadURL);
        for (const visualElements of renderTo.querySelectorAll('.datapos-highcharts-chart')) {
            const datasetOptions = decodeURIComponent((visualElements as HTMLElement).dataset.options);
            try {
                type VisualOptions = {
                    views: [CartesianCategory | RangeCategory | ValuesCategory];
                };
                type CartesianCategory = { category: { id: 'cartesian' }; types: { id: 'area' | 'bar' | 'column' | 'line' | 'radar' }[] };
                type RangeCategory = { category: { id: 'range' }; types: { id: 'bar' | 'column' }[] };
                type ValuesCategory = { category: { id: 'values' } };

                const typeMap: Record<string, { label: Record<string, string> }> = {
                    area: { label: { 'en-gb': 'Area' } },
                    bar: { label: { 'en-gb': 'Bar' } },
                    column: { label: { 'en-gb': 'Column' } },
                    line: { label: { 'en-gb': 'Line' } },
                    radar: { label: { 'en-gb': 'Radar' } }
                };

                const visualOptions = JSON.parse(datasetOptions) as VisualOptions;
                // for (const series of options.series) {
                //     (series as SeriesLineOptions).data = this.sampleData.getMeasureValues(series.measureId);
                // }
                // element.textContent = '';
                // Highcharts.chart(element, options);
                const tabBarElement = document.createElement('div');
                Object.assign(tabBarElement.style, { display: 'flex' });
                for (const view of visualOptions.views) {
                    switch (view.category.id) {
                        case 'cartesian':
                            for (const type of (view as CartesianCategory).types) {
                                const element = document.createElement('div');
                                element.textContent = type.id;
                                tabBarElement.appendChild(element);
                            }
                            break;
                        case 'range':
                            for (const type of (view as RangeCategory).types) {
                                const element = document.createElement('div');
                                element.textContent = typeMap[type.id].label['en-gb'];
                                tabBarElement.appendChild(element);
                            }
                            break;
                        case 'values':
                            const element = document.createElement('div');
                            element.textContent = view.category.id;
                            tabBarElement.appendChild(element);
                            break;
                    }
                }
                visualElements.appendChild(tabBarElement);
            } catch (error) {
                console.error(error);
                visualElements.textContent = 'Invalid options.';
            }
        }
    }
}
