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
            console.log(4444, infoSegments);
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

        const downloadURL = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/highcharts.src.js';
        const Highcharts = (await import(/* @vite-ignore */ downloadURL)).default;
        for (const chartEl of renderTo.querySelectorAll('.datapos-highcharts-chart')) {
            const datasetOptions = decodeURIComponent((chartEl as HTMLElement).dataset.options);
            try {
                const options = JSON.parse(datasetOptions);
                // options.series = series;
                chartEl.textContent = '';
                Highcharts.chart(chartEl, options);
            } catch (err) {
                console.error('Highcharts parse error:', err);
                chartEl.textContent = 'Invalid chart JSON';
            }
        }
    }
}
