// Dependencies
import type { Axis, ChartCallbackFunction, ChartOptions, LegendOptions, Options, SubtitleOptions, TitleOptions, XAxisOptions, YAxisOptions } from 'highcharts';
import type { Presenter, PresenterConfig, PresenterItemConfig, PresenterLocalisedConfig } from '@datapos/datapos-shared';
// import type { Series, SeriesAreaOptions, SeriesBarOptions, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';
import config from '../config.json';

import { Buffer } from 'buffer';
import MarkdownIt from 'markdown-it';
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

    async render(id: string, renderTo: HTMLElement): Promise<void> {
        // const Highcharts = (await import('highcharts')).default;
        const url = 'https://cdn.jsdelivr.net/npm/highcharts@11.4.3/es-modules/masters/highcharts.src.js';
        const Highcharts = (await import(/* @vite-ignore */ url)).default;

        // new Highcharts.Chart(renderTo, {
        //     chart: { type: 'bar' },
        //     title: { text: 'Fruit Consumption' },
        //     xAxis: { categories: ['Apples', 'Bananas', 'Oranges'] },
        //     yAxis: { title: { text: 'Fruit eaten' } },
        //     series: [
        //         { name: 'Jane', data: [1, 0, 4] },
        //         { name: 'John', data: [5, 7, 3] }
        //     ]
        // } as Options);

        if (typeof window !== 'undefined' && !window.Buffer) window.Buffer = Buffer;

        const rawFile = `---
title: 
    en: Physical Headcount
description:
    en: This is a description...
focus: hr
model: wrkFor
---

# {{title}}

{{description}}

## Q2 Overview

This quarter saw significant revenue growth.

\`\`\`chart
{
    "chart": { "type": "column" },
    "title": { "text": "{{title}}" },
    "xAxis": { "categories": ["Q1", "Q2", "Q3"] },
    "yAxis": { "title": { "text": "Revenue" } },
    "series": [{ "name": "Revenue", "data": [100, 140, 180] }]
}
\`\`\`

Some additional text here.
`;

        const { data: frontmatter, content: markdown } = matter(rawFile);
        console.log(1111, frontmatter, markdown);

        const processedMarkdown = markdown.replace(/\{\{(\w+)\}\}/g, (_, key) => {
            return frontmatter[key] ?? `{{${key}}}`;
        });
        console.log(2222, processedMarkdown);

        const md = new MarkdownIt({
            highlight: (str, lang) => {
                if (lang === 'json' || lang === 'chart') {
                    const id = `chart-${Math.random().toString(36).slice(2)}`;
                    return `<div class="chart" data-id="${id}" data-code="${encodeURIComponent(str)}"></div>`;
                }
                return '';
            }
        });

        const html = md.render(processedMarkdown);
        console.log(3333, html);
        renderTo.innerHTML = html;

        for (const chartEl of renderTo.querySelectorAll('.chart')) {
            const text = decodeURIComponent((chartEl as HTMLElement).dataset.code);
            try {
                const options = JSON.parse(text);
                chartEl.textContent = '';
                Highcharts.chart(chartEl, options);
            } catch (err) {
                console.error('Highcharts parse error:', err);
                chartEl.textContent = 'Invalid chart JSON';
            }
        }
    }
}
