/**
 * Default presenter class.
 */

// Dependencies - Vendor.
import type { Token } from 'micromark-util-types';

// Dependencies - Framework.
import type { ComponentRef } from '@datapos/datapos-shared';
import { presentationViewTypeMap } from '@datapos/datapos-shared';
import type { PresentationConfig, PresentationVisualConfig, PresentationVisualViewType } from '@datapos/datapos-shared';
import type {
    PresentationVisualCartesianViewConfig,
    PresentationVisualPolarViewConfig,
    PresentationVisualRangeViewConfig,
    PresentationVisualValuesViewConfig
} from '@datapos/datapos-shared';
import type {
    PresentationVisualCartesianViewType,
    PresentationVisualPolarViewType,
    PresentationVisualRangeViewType,
    PresentationVisualValuesViewType
} from '@datapos/datapos-shared';
import type { Presenter, PresenterConfig, PresenterLocalisedConfig, PresenterTools } from '@datapos/datapos-shared';
import { useDataTable, useHighcharts } from '@datapos/datapos-shared';

// Dependencies - Data.
import config from '~/config.json';
import configPresentations from '~/configPresentations.json';
import { useSampleData } from '@/composers/useSampleData';

// Classes - Default presenter.
export default class DefaultPresenter implements Presenter {
    readonly config: PresenterConfig;
    readonly tools: PresenterTools;
    readonly dataTable;
    readonly highcharts;
    readonly sampleData;

    micromarkTool: any;

    constructor(tools: PresenterTools) {
        this.config = config as PresenterConfig;
        // this.tools = tools;
        this.dataTable = useDataTable();
        this.highcharts = useHighcharts();
        this.sampleData = useSampleData();
    }

    // Operations - List.
    list(): ComponentRef[] {
        return this.config.presentations;
    }

    // Operations - Render.
    async render(presentationPath: keyof typeof configPresentations, renderTo: HTMLElement, data?: unknown): Promise<void> {
        // Use presentation path to retrieve presentation.
        const presentation = configPresentations[presentationPath] as PresentationConfig;

        // TODO: Remove
        const chartJS = await import('chart.js');
        console.log('chartJS', chartJS);

        // Substitute values for label and description placeholders in content.
        let processedMarkdown = presentation.content;
        processedMarkdown = processedMarkdown
            .replace(/\{\{label\}\}/g, presentation.label?.['en-gb'] ?? `{{label}}`)
            .replace(/\{\{description\}\}/g, presentation.description?.['en-gb'] ?? `{{description}}`);

        // ???
        function presenterCodeBlock(options: Record<string, unknown>) {
            const data = { codeContent: '', lang: '', meta: '' };
            return {
                enter: {
                    codeFenced() /* The entire fenced code block starts. */ {
                        this.buffer();
                        data.codeContent = '';
                        data.lang = '';
                        data.meta = '';
                    },
                    codeFencedFence() /* The opening fence line. */ {},
                    codeFencedFenceSequence() /* The opening fence characters (```). */ {},
                    codeFencedFenceInfo(token: Token) /* The language identifier (json, javascript...). */ {
                        data.lang = this.sliceSerialize(token);
                    },
                    codeFencedFenceMeta(token: Token) /* The metadata after the language identifier (datapos-visual). */ {
                        data.meta = this.sliceSerialize(token);
                    },
                    codeFlowValue(token: Token) /* Each line/chunk of actual code content. */ {
                        data.codeContent = data.codeContent + this.sliceSerialize(token) + '\n';
                    }
                },
                exit: {
                    codeFlowValue() /*  Done capturing the code. */ {},
                    codeFencedFenceMeta() /* Done processing the metadata. */ {},
                    codeFencedFenceInfo() /* Done processing the language identifier. */ {},
                    codeFencedFenceSequence() /* The closing fence characters (```). */ {},
                    codeFencedFence() /* The closing fence line. */ {},
                    codeFenced() /* The entire code block is complete, replacement can happen now. */ {
                        this.resume(); // Discard the captured code text.
                        const rawContent = data.codeContent || '';
                        const lang = data.lang || 'plain';
                        const meta = data.meta || '';
                        let html = '';
                        if (lang === 'json' && meta === 'datapos-visual') {
                            html = `<div class="${meta}" data-options="${encodeURIComponent(rawContent)}"></div>`;
                        } else {
                            if (data.codeContent.endsWith('\n')) data.codeContent = data.codeContent.slice(0, -1);
                            if (lang && globalThis.Prism && globalThis.Prism.languages[lang]) {
                                console.log('languages', lang, globalThis.Prism.languages);
                                const highlighted = globalThis.Prism.highlight(rawContent, globalThis.Prism.languages[lang], lang);
                                html = `<pre class="language-${lang}"><code>${highlighted}</code></pre>`;
                            } else {
                                const escaped = rawContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
                                html = `<pre class="language-text"><code>${escaped}</code></pre>`;
                            }
                        }
                        this.raw(html);
                    }
                }
            };
        }

        // Render markdown to HTML
        this.loadMicromarkTool();
        const customCodeBlockHtmlExtension = presenterCodeBlock.call({});
        // const html = this.tools.micromark(processedMarkdown, {
        //     allowDangerousHtml: true,
        //     extensions: [this.tools.gfmExtension(), this.tools.mathExtension()],
        //     htmlExtensions: [this.tools.gfmHtmlExtension(), this.tools.mathHtmlExtension(), customCodeBlockHtmlExtension]
        // });
        const html = this.micromarkTool.render(processedMarkdown);
        renderTo.innerHTML = html;

        // ????
        for (const visualElements of renderTo.querySelectorAll('.datapos-visual')) {
            const datasetOptions = decodeURIComponent((visualElements as HTMLElement).dataset.options);
            try {
                const visualConfig = JSON.parse(datasetOptions) as PresentationVisualConfig;

                if (!data) {
                    for (const measure of visualConfig.content.data.measures) {
                        measure.data = this.sampleData.getMeasureValues([measure.id]);
                    }
                }

                const tabBarElement = document.createElement('div');
                tabBarElement.className = 'dp-tab-bar';
                const viewContainerElement = document.createElement('div');
                let defaultViewType: PresentationVisualViewType | undefined = undefined;
                for (const viewConfig of visualConfig.views) {
                    const viewCategoryId = viewConfig.categoryId;
                    switch (viewCategoryId) {
                        case 'cartesian': {
                            const cartesianViewConfig = viewConfig as PresentationVisualCartesianViewConfig;
                            const viewType = presentationViewTypeMap[`${viewCategoryId}_${cartesianViewConfig.typeId}`] as PresentationVisualCartesianViewType;
                            if (!defaultViewType || cartesianViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highcharts.renderCartesianChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'polar': {
                            const polarViewConfig = viewConfig as PresentationVisualPolarViewConfig;
                            const viewType = presentationViewTypeMap[`${viewCategoryId}_${polarViewConfig.typeId}`] as PresentationVisualPolarViewType;
                            if (!defaultViewType || polarViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highcharts.renderPolarChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'range': {
                            const rangeViewConfig = viewConfig as PresentationVisualRangeViewConfig;
                            const viewType = presentationViewTypeMap[`${viewCategoryId}_${rangeViewConfig.typeId}`] as PresentationVisualRangeViewType;
                            if (!defaultViewType || rangeViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highcharts.renderRangeChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'values': {
                            const valuesViewConfig = viewConfig as PresentationVisualValuesViewConfig;
                            const viewType = presentationViewTypeMap[viewCategoryId] as PresentationVisualValuesViewType;
                            if (!defaultViewType) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.dataTable.render(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                    }
                }
                visualElements.appendChild(tabBarElement);
                visualElements.appendChild(viewContainerElement);
                switch (defaultViewType.categoryId) {
                    case 'cartesian':
                        this.highcharts.renderCartesianChart(defaultViewType as PresentationVisualCartesianViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'polar':
                        this.highcharts.renderPolarChart(defaultViewType as PresentationVisualPolarViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'range':
                        this.highcharts.renderRangeChart(defaultViewType as PresentationVisualRangeViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'values':
                        this.dataTable.render(defaultViewType as PresentationVisualValuesViewType, visualConfig.content, viewContainerElement);
                        break;
                }
            } catch (error) {
                console.error(error);
                visualElements.textContent = 'Invalid options.';
            }
        }
    }

    private async loadMicromarkTool(): Promise<void> {
        if (this.micromarkTool) return;
        const url = 'https://engine-eu.datapos.app/tools/v0.1.858/datapos-tool-micromark.es.js';
        this.micromarkTool = new (await import(url))();
    }
}
