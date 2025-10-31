// Dependencies
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { Presenter, PresenterConfig, PresenterItemConfig, PresenterLocalisedConfig } from '@datapos/datapos-shared';
// import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';
import config from '../config.json';
import configPresentations from '../configPresentations.json';
import markdownIt from 'markdown-it';

import { useSampleData } from './sampleData/useSampleData';

const sampleData = useSampleData();

type ColorConfig = { border: string; fillOpaque?: string; fillTranslucent: string };
type Measure = { id: string; source?: (row: Record<string, number>) => number };
type MeasureValueMap = Record<string, number[]>;

function buildMeasureMap(data: Record<string, number>[], measures: Measure[]): MeasureValueMap {
    return data.reduce((result, row) => {
        measures.forEach((measure) => {
            if (measure.source)
                if (typeof measure.source === 'function') result[measure.id].push(measure.source(row));
                else result[measure.id].push(row[String(measure.source)]);
            else result[measure.id].push(row[measure.id]);
        });
        return result;
    }, buildEmptyMeasureValueMap(measures));
}

function buildEmptyMeasureValueMap(measures: Measure[]): MeasureValueMap {
    // @ts-ignore
    return measures.reduce((result, measure) => ({ ...result, [measure.id]: [] }), {});
}

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
        const presentation = configPresentations[presentationPath];
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

        // let series;
        const markdownParser = new markdownIt();
        markdownParser.renderer.rules.fence = (tokens, index) => {
            const token = tokens[index];
            const infoSegments = token.info.split(' ');
            console.log(4444, infoSegments);
            const langName = infoSegments[0]?.trim() ?? undefined;
            const typeId = infoSegments[1]?.trim() ?? undefined;
            const content = token.content;
            switch (typeId) {
                // case 'datapos-data': {
                //     // const dataId = infoSegments[1].trim();
                //     const dataOptions = JSON.parse(content);
                //     series = dataOptions.series;
                //     return '';
                // }
                case 'datapos-highcharts-chart': {
                    // const dataId = `${typeId}-${Math.random().toString(36).slice(2)}`;
                    return `<div class="${typeId}" data-options="${encodeURIComponent(content)}"></div>`;
                }
                default:
                    return `<pre><code class="language-${langName}">${content}</code></pre>`;
            }
        };
        const html = markdownParser.render(processedMarkdown);
        renderTo.innerHTML = html;

        // const measureValueMap = buildMeasureMap(headcountForCalendarYear.months, [
        //     { id: 'openingHeadcount' },
        //     { id: 'startingHeadcount', source: (row) => row.openingHeadcount + row.startingHires },
        //     { id: 'endingHeadcount', source: (row) => row.closingHeadcount + row.endingTerminations },
        //     { id: 'closingHeadcount' },
        //     // @ts-expect-error
        //     { id: 'openingClosingHeadcounts', source: (row) => buildBarRange(row.openingHeadcount, row.closingHeadcount) },
        //     // @ts-expect-error
        //     { id: 'startingEndingHeadcounts', source: (row) => buildBarRange(row.openingHeadcount + row.startingHires, row.closingHeadcount + row.endingTerminations, 0) }
        // ]);

        const downloadURL = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/highcharts.src.js';
        const Highcharts = (await import(/* @vite-ignore */ downloadURL)).default;
        for (const chartEl of renderTo.querySelectorAll('.datapos-visual-highcharts-chart')) {
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

const Colors: Record<string, ColorConfig> = {
    axis: { border: '#F2F2F2', fillTranslucent: '#F2F2F2' },
    blue: { border: '#36A2EB', fillTranslucent: '#24A2EB80' },
    darkGrey: { border: '#6B7280', fillTranslucent: '#6B728080' },
    fillAbove: { border: '#BBF7D080', fillTranslucent: '#BBF7D080' },
    fillBelow: { border: '#FEF08A80', fillTranslucent: '#FEF08A80' },
    green: { border: '#4BC0C0', fillTranslucent: '#4BC0C080' },
    grey: { border: '#C9CBCE', fillTranslucent: '#C9CBCE80' },
    negative: { border: '#FF9F40', fillOpaque: '#FFD0A8', fillTranslucent: '#FF9F4080' },
    orange: { border: '#FF9F40', fillTranslucent: '#FF9F4080' },
    pink: { border: '#FF6384', fillTranslucent: '#FF636C80' },
    positive: { border: '#4BC0C0', fillOpaque: '#ABE0E0', fillTranslucent: '#4BC0C080' },
    purple: { border: '#9966FF', fillTranslucent: '#9966FF80' },
    transparent: { border: 'transparent', fillTranslucent: 'transparent' },
    yellow: { border: '#FFCD56', fillTranslucent: '#FFCD5680' }
};

const Patterns = [
    { path: { d: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5', strokeWidth: 1 }, height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5', height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 2 0 L 2 5 M 4 0 L 4 5', height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 0 2 L 5 2 M 0 4 L 5 4', height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 0 1.5 L 2.5 1.5 L 2.5 0 M 2.5 5 L 2.5 3.5 L 5 3.5', height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 0 0 L 5 10 L 10 0', height: 10, width: 10 },
    { path: 'M 3 3 L 8 3 L 8 8 L 3 8 Z', height: 10, width: 10 },
    { path: 'M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0', height: 10, width: 10 },
    { path: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11', height: 10, width: 10 },
    { path: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9', height: 10, width: 10 }
];

function buildBarRange(low: number, high: number, patternIndex?: number) {
    let borderColor: string;
    let fillOpaqueColor: string;
    let fillTranslucentColor: string;
    if (high < low) {
        borderColor = Colors.negative.border;
        fillOpaqueColor = 'white';
        fillTranslucentColor = Colors.negative.fillTranslucent;
    } else {
        borderColor = Colors.positive.border;
        fillOpaqueColor = 'white';
        fillTranslucentColor = Colors.positive.fillTranslucent;
    }
    return {
        borderColor,
        color: patternIndex === undefined ? fillTranslucentColor : { pattern: { ...Patterns[patternIndex], color: borderColor, backgroundColor: fillOpaqueColor } },
        fillTranslucentColor,
        low,
        high
    };
}
