/**
 * Default presenter class.
 */

// Dependencies - Vendor.
// import type MarkdownIt from 'markdown-it';
import type { CompileContext, HtmlExtension, Options, Token } from 'micromark-util-types';

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

// Classes - Default Presenter
export default class DefaultPresenter implements Presenter {
    readonly config: PresenterConfig;
    readonly tools: PresenterTools;
    readonly dataTable;
    readonly highcharts;
    readonly sampleData;

    constructor(tools: PresenterTools) {
        this.config = config as PresenterConfig;
        this.tools = tools;
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

        // Substitute values for label and description placeholders in content.
        let processedMarkdown = presentation.content;
        processedMarkdown = processedMarkdown
            .replace(/\{\{label\}\}/g, presentation.label?.['en-gb'] ?? `{{label}}`)
            .replace(/\{\{description\}\}/g, presentation.description?.['en-gb'] ?? `{{description}}`);

        /*
        //         let html = '';
        //         if (typeId === 'datapos-visual') {
        //             html = `<div class="${typeId}" data-options="${encodeURIComponent(content)}"></div>`;
        //         } else {
        //             // Using Prism for syntax highlighting
        //             if (langName && this.tools?.prism?.languages[langName]) {
        //                 const highlighted = this.tools.prism.highlight(content, this.tools.prism.languages[langName], langName);
        //                 html = `<pre class="language-${langName}"><code>${highlighted}</code></pre>`;
        //             } else {
        //                 // Fallback: escape HTML entities
        //                 const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
        //                 html = `<pre class="language-text"><code>${escaped}</code></pre>`;
        //             }
        //         }
        //         this.raw(html);
        */

        function customCodeBlockHtml() {
            // let codeContent;
            return {
                enter: {
                    codeFenced() {
                        this.buffer(); // Start buffering to suppress default output
                        this.data = this.data || {};
                        this.data.codeContent = '';
                    },
                    // codeIndented() {
                    //     this.buffer();
                    //     this.data = this.data || {};
                    //     this.data.codeContent = '';
                    // },
                    // Only capture the actual code text (not lang or meta)
                    codeFlowValue(token) {
                        this.data = this.data || {};
                        this.data.codeContent = (this.data.codeContent || '') + this.sliceSerialize(token);
                    }
                },
                exit: {
                    // codeFlowValue() {
                    //     // Exit handler - just pass through
                    // },
                    codeFenced() {
                        this.resume(); // Stop buffering and discard default output

                        const rawContent = (this.data && this.data.codeContent) || '';
                        const lineCount = rawContent.split('\n').length;
                        const charCount = rawContent.length;

                        // Replace with custom message that shows info about original content
                        this.raw(
                            `<div class="code-block-replaced" style="padding: 10px; background: #f5f5f5; border-left: 4px solid #666;">` +
                                `📝 Code block hidden (${lineCount} lines, ${charCount} characters)<br>` +
                                `<details style="margin-top: 10px;"><summary style="cursor: pointer;">Show raw content preview</summary>` +
                                `<pre style="margin-top: 5px; padding: 10px; background: white; overflow: auto;">${rawContent.substring(0, 200)}...</pre></details>` +
                                `</div>`
                        );

                        // Clean up
                        if (this.data) {
                            delete this.data.codeContent;
                        }
                    }
                    // codeIndented() {
                    //     this.resume();

                    //     const rawContent = (this.data && this.data.codeContent) || '';
                    //     const lineCount = rawContent.split('\n').length;

                    //     this.raw(
                    //         `<div class="code-block-replaced" style="padding: 10px; background: #f5f5f5; border-left: 4px solid #666;">` +
                    //             `📝 Indented code block hidden (${lineCount} lines)<br>` +
                    //             `<details style="margin-top: 10px;"><summary style="cursor: pointer;">Show raw content</summary>` +
                    //             `<pre style="margin-top: 5px; padding: 10px; background: white; overflow: auto;">${rawContent}</pre></details>` +
                    //             `</div>`
                    //     );

                    //     if (this.data) {
                    //         delete this.data.codeContent;
                    //     }
                    // }
                }
            };
        }

        // Render markdown to HTML
        const htmlExtension = customCodeBlockHtml.call({ tools: this.tools });
        const html = this.tools.micromark(processedMarkdown, { allowDangerousHtml: true, htmlExtensions: [htmlExtension] });
        renderTo.innerHTML = html;

        // // Construct markdown parser.
        // const markdownParser: MarkdownIt = new this.tools.MarkdownIt({ html: true });
        // markdownParser.renderer.rules.fence = (tokens, index) => {
        //     const token = tokens[index];
        //     const infoSegments = token.info.split(' ');
        //     const langName = infoSegments[0]?.trim() ?? undefined;
        //     const typeId = infoSegments[1]?.trim() ?? undefined;
        //     const content = token.content;
        //     switch (typeId) {
        //         case 'datapos-visual':
        //             return `<div class="${typeId}" data-options="${encodeURIComponent(content)}"></div>`;
        //         default: {
        //             // // return `<pre><code class="language-${langName}">${content}</code></pre>`;
        //             // if (langName && this.tools.hljs.getLanguage(langName)) {
        //             //     try {
        //             //         return `<pre class="hljs"><code>${this.tools.hljs.highlight(content, { language: langName }).value}</code></pre>`;
        //             //     } catch (_) {}
        //             // }
        //             // return `<pre class="hljs"><code>${markdownParser.utils.escapeHtml(content)}</code></pre>`;
        //             console.log(this.tools);
        //             if (langName && this.tools.prism.languages[langName]) {
        //                 const highlighted = this.tools.prism.highlight(content, this.tools.prism.languages[langName], langName);
        //                 return `<pre class="language-${langName}"><code>${highlighted}</code></pre>`;
        //             }
        //             // fallback (no lang or unknown)
        //             const escaped = markdownParser.utils.escapeHtml(content);
        //             return `<pre class="language-text"><code>${escaped}</code></pre>`;
        //         }
        //     }
        // };

        // // Render html from markdown and inset into  placeholder element.
        // const html = markdownParser.render(processedMarkdown);
        // renderTo.innerHTML = html;

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
}
