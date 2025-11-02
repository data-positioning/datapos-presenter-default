// Dependencies - Framework.
import { useDataTable } from '@/composers/useDataTable';
import { useHighcharts } from '@/composers/useHighcharts';
import type { ComponentRef, PresentationConfig, Presenter, PresenterConfig, PresenterLocalisedConfig, PresenterTools } from '@datapos/datapos-shared';

// Dependencies - Data.
import config from '~/config.json';
import configPresentations from '~/configPresentations.json';

export type VisualOptions = { content: VisualContentOptions; views: [CartesianViewCategory | PolarViewCategory | RangeViewCategory | ValuesViewCategory] };
export type VisualContentOptions = { title: { text: string }; data: { name: string; categoryLabels: string[]; measures: { id: string; name: string }[] } };
export type CartesianViewCategory = { category: { id: 'cartesian' }; types: { id: 'area' | 'bar' | 'column' | 'line'; default?: boolean }[] };
export type PolarViewCategory = { category: { id: 'polar' }; types: { id: 'area' | 'column' | 'line'; default?: boolean }[] };
export type RangeViewCategory = { category: { id: 'range' }; types: { id: 'bar' | 'column'; default?: boolean }[] };
export type ValuesViewCategory = { category: { id: 'values'; default?: boolean } };
export type CartesianViewType = { label: Record<string, string>; options: { highchartsType: 'area' | 'bar' | 'column' | 'line'; inverted?: boolean } };
export type PolarViewType = { label: Record<string, string>; options: { highchartsType: 'area' | 'column' | 'line'; inverted?: boolean } };
export type RangeViewType = { label: Record<string, string>; options: { highchartsType: 'arearange' | 'columnrange'; inverted?: boolean } };
export type ValuesViewType = { label: Record<string, string>; options: {} };

// Constants
const viewTypeMap: Record<string, CartesianViewType | PolarViewType | RangeViewType | ValuesViewType> = {
    cartesian_area: { label: { 'en-gb': 'Area' }, options: { highchartsType: 'area' } },
    cartesian_bar: { label: { 'en-gb': 'Bar' }, options: { highchartsType: 'bar' } },
    cartesian_column: { label: { 'en-gb': 'Column' }, options: { highchartsType: 'column' } },
    cartesian_line: { label: { 'en-gb': 'Line' }, options: { highchartsType: 'line' } },
    chordDiagram: { label: { 'en-gb': 'Chord Diagram' }, options: {} },
    polar_area: { label: { 'en-gb': 'Radar (Area)' }, options: { highchartsType: 'area' } },
    polar_column: { label: { 'en-gb': 'Radar (Column)' }, options: { highchartsType: 'column' } },
    polar_line: { label: { 'en-gb': 'Radar (Line)' }, options: { highchartsType: 'line' } },
    range_area: { label: { 'en-gb': 'Range (Area)' }, options: { highchartsType: 'arearange' } },
    range_bar: { label: { 'en-gb': 'Range (Bar)' }, options: { highchartsType: 'columnrange', inverted: true } },
    range_column: { label: { 'en-gb': 'Range (Column)' }, options: { highchartsType: 'columnrange' } },
    sankeyDiagram: { label: { 'en-gb': 'Sankey Diagram' }, options: {} },
    streamgraph: { label: { 'en-gb': 'Streamgraph' }, options: {} },
    values: { label: { 'en-gb': 'Values' }, options: {} }
};

// Classes - Default Presenter
export default class DefaultPresenter implements Presenter {
    readonly config: PresenterConfig;
    readonly tools: PresenterTools;
    readonly dataTable;
    readonly highcharts;

    constructor(tools: PresenterTools) {
        this.config = config as PresenterConfig;
        this.tools = tools;
        this.dataTable = useDataTable();
        this.highcharts = useHighcharts();
    }

    // Operations - List.
    list(): ComponentRef[] {
        return this.config.presentations;
    }

    // Operations - Render.
    async render(presentationPath: keyof typeof configPresentations, renderTo: HTMLElement): Promise<void> {
        // Use presentation path to retrieve presentation.
        const presentation = configPresentations[presentationPath] as PresentationConfig;

        // Substitute values for label and description placeholders in content.
        let processedMarkdown = presentation.content;
        processedMarkdown = processedMarkdown
            .replace(/\{\{label\}\}/g, presentation.label?.['en-gb'] ?? `{{label}}`)
            .replace(/\{\{description\}\}/g, presentation.description?.['en-gb'] ?? `{{description}}`);

        // Construct markdown parser.
        const markdownParser = new this.tools.markdownIt();
        markdownParser.renderer.rules.fence = (tokens, index) => {
            const token = tokens[index];
            const infoSegments = token.info.split(' ');
            const langName = infoSegments[0]?.trim() ?? undefined;
            const typeId = infoSegments[1]?.trim() ?? undefined;
            const content = token.content;
            switch (typeId) {
                case 'datapos-visual':
                    return `<div class="${typeId}" data-options="${encodeURIComponent(content)}"></div>`;
                default:
                    return `<pre><code class="language-${langName}">${content}</code></pre>`;
            }
        };

        // Render html from markdown and inset into  placeholder element.
        const html = markdownParser.render(processedMarkdown);
        renderTo.innerHTML = html;

        for (const visualElements of renderTo.querySelectorAll('.datapos-visual')) {
            const datasetOptions = decodeURIComponent((visualElements as HTMLElement).dataset.options);
            try {
                const visualOptions = JSON.parse(datasetOptions) as VisualOptions;
                const tabBarElement = document.createElement('div');
                tabBarElement.className = 'dp-tab-bar';
                const viewContainerElement = document.createElement('div');
                let defaultViewCategory = undefined;
                let defaultViewType: CartesianViewType | PolarViewType | RangeViewType | ValuesViewType | undefined = undefined;
                for (const view of visualOptions.views) {
                    // TODO: Collapse category and type into type.
                    const viewCategory = view.category;
                    switch (viewCategory.id) {
                        case 'cartesian':
                            for (const type of (view as CartesianViewCategory).types) {
                                const viewType = viewTypeMap[`${viewCategory.id}_${type.id}`] as CartesianViewType;
                                if (!defaultViewType || type.default) {
                                    defaultViewCategory = viewCategory;
                                    defaultViewType = viewType;
                                }
                                const element = document.createElement('div');
                                element.textContent = viewType.label['en-gb'];
                                element.addEventListener('click', () => this.highcharts.renderCartesianChart(viewType, visualOptions.content, viewContainerElement));
                                tabBarElement.appendChild(element);
                            }
                            break;
                        case 'polar':
                            for (const type of (view as PolarViewCategory).types) {
                                const viewType = viewTypeMap[`${viewCategory.id}_${type.id}`] as PolarViewType;
                                if (!defaultViewType || type.default) {
                                    defaultViewCategory = viewCategory;
                                    defaultViewType = viewType;
                                }
                                const element = document.createElement('div');
                                element.textContent = viewType.label['en-gb'];
                                element.addEventListener('click', () => this.highcharts.renderPolarChart(viewType, visualOptions.content, viewContainerElement));
                                tabBarElement.appendChild(element);
                            }
                            break;
                        case 'range':
                            for (const type of (view as RangeViewCategory).types) {
                                const viewType = viewTypeMap[`${viewCategory.id}_${type.id}`] as RangeViewType;
                                if (!defaultViewType || type.default) {
                                    defaultViewCategory = viewCategory;
                                    defaultViewType = viewType;
                                }
                                const element = document.createElement('div');
                                element.textContent = viewType.label['en-gb'];
                                element.addEventListener('click', () => this.highcharts.renderRangeChart(viewType, visualOptions.content, viewContainerElement));
                                tabBarElement.appendChild(element);
                            }
                            break;
                        case 'values':
                            const viewType = viewTypeMap[viewCategory.id] as ValuesViewType;
                            if (!defaultViewType) {
                                defaultViewCategory = viewCategory;
                                defaultViewType = viewType;
                            }
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.dataTable.render(viewType, visualOptions.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                    }
                }
                visualElements.appendChild(tabBarElement);
                visualElements.appendChild(viewContainerElement);
                switch (defaultViewCategory.id) {
                    case 'cartesian':
                        this.highcharts.renderCartesianChart(defaultViewType as CartesianViewType, visualOptions.content, viewContainerElement);
                        break;
                    case 'polar':
                        this.highcharts.renderPolarChart(defaultViewType as PolarViewType, visualOptions.content, viewContainerElement);
                        break;
                    case 'range':
                        this.highcharts.renderRangeChart(defaultViewType as RangeViewType, visualOptions.content, viewContainerElement);
                        break;
                    case 'values':
                        this.dataTable.render(defaultViewType as ValuesViewType, visualOptions.content, viewContainerElement);
                        break;
                }
            } catch (error) {
                console.error(error);
                visualElements.textContent = 'Invalid options.';
            }
        }
    }
}
