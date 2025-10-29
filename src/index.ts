// Dependencies
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { Presenter, PresenterConfig, PresenterItemConfig, PresenterLocalisedConfig } from '@datapos/datapos-shared';
// import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';
import config from '../config.json';
import configPresentations from '../configPresentations.json';

import { Buffer } from 'buffer';
import markdownIt from 'markdown-it';
import matter from 'gray-matter';

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

        if (typeof window !== 'undefined' && !window.Buffer) window.Buffer = Buffer;

        const rawFile = configPresentations[presentationPath];

        const { data: frontmatter, content: markdown } = matter(rawFile);
        const processedMarkdown = markdown.replace(/\{\{(\w+)\}\}/g, (_, key) => {
            return frontmatter[key].en ?? `{{${key}}}`;
        });
        let series;
        const markdownParser = new markdownIt({
            highlight: (options, blockName, attributes) => {
                switch (blockName) {
                    case 'data': {
                        const dataId = attributes.split(' ')[0];
                        const dataOptions = JSON.parse(options);
                        series = dataOptions.series;
                        return '<span/>';
                    }
                    case 'visual': {
                        const typeId = attributes.split(' ')[0];
                        const dataId = `${typeId}-${Math.random().toString(36).slice(2)}`;
                        return `<div class="${typeId}" data-id="${dataId}" data-options="${encodeURIComponent(options)}"></div>`;
                    }
                    default:
                        return '<span/>';
                }
            }
        }); // Override the fence (code block) renderer
        markdownParser.renderer.rules.fence = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            const langName = token.info.trim();
            const content = token.content;
            return content;
        };
        const html = markdownParser.render(processedMarkdown);
        renderTo.innerHTML = html;

        for (const chartEl of renderTo.querySelectorAll('.highcharts-chart')) {
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
