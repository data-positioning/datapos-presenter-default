// Dependencies
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { Presenter, PresenterConfig, PresenterItemConfig, PresenterLocalisedConfig } from '@datapos/datapos-shared';
// import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';
import config from '../config.json';
import configPresentations from '../configPresentations.json';

// import frontMatter from 'front-matter';
import markdownIt from 'markdown-it';

// Classes - Default Presenter
export default class DefaultPresenter implements Presenter {
    readonly config: PresenterConfig;

    constructor() {
        this.config = config as PresenterConfig;
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
        const downloadURL = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/highcharts.src.js';
        const Highcharts = (await import(/* @vite-ignore */ downloadURL)).default;

        // if (typeof window !== 'undefined' && !window.Buffer) window.Buffer = Buffer;
        // const { data: frontmatter, content: markdown } = matter(rawFile);

        const rawFile = configPresentations[presentationPath];
        // var content = frontMatter<{ label: Record<string, string>; description: Record<string, string>; order: number }>(rawFile.content);
        console.log(rawFile.content);
        console.log(333, rawFile);

        // const processedMarkdown = rawFile.content.replace(/\{\{(\w+)\}\}/g, (_, key: keyof typeof content.attributes) => {
        //     switch (key) {
        //         case 'label':
        //             return content.attributes[key].en ?? `{{${key}}}`;
        //         case 'description':
        //             return content.attributes[key].en ?? `{{${key}}}`;
        //         default:
        //             return String(content.attributes[key]) ?? `{{${key}}}`;
        //     }
        // });
        const processedMarkdown = rawFile.content;

        let series;
        const markdownParser = new markdownIt();
        markdownParser.renderer.rules.fence = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            const infoSegments = token.info.split(' ');
            const blockName = infoSegments[0].trim();
            const content = token.content;

            switch (blockName) {
                case 'datapos-data': {
                    const dataId = infoSegments[1].trim();
                    const dataOptions = JSON.parse(content);
                    series = dataOptions.series;
                    return '';
                }
                case 'datapos-visual': {
                    const typeId = infoSegments[1].trim();
                    // const dataId = `${typeId}-${Math.random().toString(36).slice(2)}`;
                    return `<div class="${blockName}-${typeId}" data-options="${encodeURIComponent(content)}"></div>`;
                }
                default:
                    return `<pre><code class="language-${blockName}">${content}</code></pre>`;
            }
        };
        const html = markdownParser.render(processedMarkdown);
        renderTo.innerHTML = html;

        for (const chartEl of renderTo.querySelectorAll('.datapos-visual-highcharts-chart')) {
            const datasetOptions = decodeURIComponent((chartEl as HTMLElement).dataset.options);
            try {
                const options = JSON.parse(datasetOptions);
                options.series = series;
                chartEl.textContent = '';
                Highcharts.chart(chartEl, options);
            } catch (err) {
                console.error('Highcharts parse error:', err);
                chartEl.textContent = 'Invalid chart JSON';
            }
        }
    }
}
