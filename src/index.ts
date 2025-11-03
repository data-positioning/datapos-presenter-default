// Dependencies - Framework.
import { useDataTable } from '@/composers/useDataTable';
import { useHighcharts } from '@/composers/useHighcharts';
import type { ComponentRef, PresentationConfig, Presenter, PresenterConfig, PresenterLocalisedConfig, PresenterTools } from '@datapos/datapos-shared';

// Dependencies - Data.
import config from '~/config.json';
import configPresentations from '~/configPresentations.json';

export type VisualConfig = { content: VisualContentConfig; views: ViewConfig[] };

export type VisualContentConfig = { title: { text: string }; data: { name: string; categoryLabels: string[]; measures: { id: string; name: string }[] } };

export interface ViewConfig {
    categoryId: 'cartesian' | 'chordDiagram' | 'polar' | 'range' | 'sankeyDiagram' | 'streamgraph' | 'values';
    default?: boolean;
}

export interface CartesianViewConfig extends ViewConfig {
    categoryId: 'cartesian';
    typeId: 'area' | 'bar' | 'column' | 'line';
}
export interface ChordDiagramViewConfig extends ViewConfig {
    categoryId: 'chordDiagram';
}
export interface PolarViewConfig extends ViewConfig {
    categoryId: 'polar';
    typeId: 'area' | 'column' | 'line';
}
export interface RangeViewConfig extends ViewConfig {
    categoryId: 'range';
    typeId: 'area' | 'bar' | 'column';
}
export interface SankeyDiagramViewConfig extends ViewConfig {
    categoryId: 'sankeyDiagram';
}
export interface StreamgraphViewConfig extends ViewConfig {
    categoryId: 'streamgraph';
}
export interface ValuesViewConfig extends ViewConfig {
    categoryId: 'values';
}

export type ViewType = CartesianViewType | ChordViewType | PolarViewType | RangeViewType | SankeyDiagramViewType | StreamgraphViewType | ValuesViewType;
export type CartesianViewType = {
    categoryId: 'cartesian';
    typeId: 'area' | 'bar' | 'column' | 'line';
    label: Record<string, string>;
    options: { highchartsType: 'area' | 'bar' | 'column' | 'line'; inverted?: boolean };
};
export type ChordViewType = { categoryId: 'chordDiagram'; label: Record<string, string>; options: {} };
export type PolarViewType = {
    categoryId: 'polar';
    typeId: 'area' | 'column' | 'line';
    label: Record<string, string>;
    options: { highchartsType: 'area' | 'column' | 'line'; inverted?: boolean };
};
export type RangeViewType = {
    categoryId: 'range';
    typeId: 'area' | 'bar' | 'column';
    label: Record<string, string>;
    options: { highchartsType: 'arearange' | 'columnrange'; inverted?: boolean };
};
export type SankeyDiagramViewType = { categoryId: 'sankeyDiagram'; label: Record<string, string>; options: {} };
export type StreamgraphViewType = { categoryId: 'streamgraph'; label: Record<string, string>; options: {} };
export type ValuesViewType = { categoryId: 'values'; label: Record<string, string>; options: {} };

// Constants
const viewTypeMap: Record<string, ViewType> = {
    cartesian_area: { categoryId: 'cartesian', typeId: 'area', label: { 'en-gb': 'Area' }, options: { highchartsType: 'area' } },
    cartesian_bar: { categoryId: 'cartesian', typeId: 'bar', label: { 'en-gb': 'Bar' }, options: { highchartsType: 'bar' } },
    cartesian_column: { categoryId: 'cartesian', typeId: 'column', label: { 'en-gb': 'Column' }, options: { highchartsType: 'column' } },
    cartesian_line: { categoryId: 'cartesian', typeId: 'line', label: { 'en-gb': 'Line' }, options: { highchartsType: 'line' } },
    chordDiagram: { categoryId: 'chordDiagram', label: { 'en-gb': 'Chord Diagram' }, options: {} },
    polar_area: { categoryId: 'polar', typeId: 'area', label: { 'en-gb': 'Radar (Area)' }, options: { highchartsType: 'area' } },
    polar_column: { categoryId: 'polar', typeId: 'column', label: { 'en-gb': 'Radar (Column)' }, options: { highchartsType: 'column' } },
    polar_line: { categoryId: 'polar', typeId: 'line', label: { 'en-gb': 'Radar (Line)' }, options: { highchartsType: 'line' } },
    range_area: { categoryId: 'range', typeId: 'area', label: { 'en-gb': 'Range (Area)' }, options: { highchartsType: 'arearange' } },
    range_bar: { categoryId: 'range', typeId: 'bar', label: { 'en-gb': 'Range (Bar)' }, options: { highchartsType: 'columnrange', inverted: true } },
    range_column: { categoryId: 'range', typeId: 'column', label: { 'en-gb': 'Range (Column)' }, options: { highchartsType: 'columnrange' } },
    sankeyDiagram: { categoryId: 'sankeyDiagram', label: { 'en-gb': 'Sankey Diagram' }, options: {} },
    streamgraph: { categoryId: 'streamgraph', label: { 'en-gb': 'Streamgraph' }, options: {} },
    values: { categoryId: 'values', label: { 'en-gb': 'Values' }, options: {} }
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
        const markdownParser = new this.tools.markdownIt({ html: true });
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
                const visualConfig = JSON.parse(datasetOptions) as VisualConfig;
                const tabBarElement = document.createElement('div');
                tabBarElement.className = 'dp-tab-bar';
                const viewContainerElement = document.createElement('div');
                let defaultViewType: ViewType | undefined = undefined;
                for (const viewConfig of visualConfig.views) {
                    const viewCategoryId = viewConfig.categoryId;
                    switch (viewCategoryId) {
                        case 'cartesian': {
                            const cartesianViewConfig = viewConfig as CartesianViewConfig;
                            const viewType = viewTypeMap[`${viewCategoryId}_${cartesianViewConfig.typeId}`] as CartesianViewType;
                            if (!defaultViewType || cartesianViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highcharts.renderCartesianChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'polar': {
                            const polarViewConfig = viewConfig as PolarViewConfig;
                            const viewType = viewTypeMap[`${viewCategoryId}_${polarViewConfig.typeId}`] as PolarViewType;
                            if (!defaultViewType || polarViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highcharts.renderPolarChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'range': {
                            const rangeViewConfig = viewConfig as RangeViewConfig;
                            const viewType = viewTypeMap[`${viewCategoryId}_${rangeViewConfig.typeId}`] as RangeViewType;
                            if (!defaultViewType || rangeViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highcharts.renderRangeChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'values': {
                            const valuesViewConfig = viewConfig as ValuesViewConfig;
                            const viewType = viewTypeMap[viewCategoryId] as ValuesViewType;
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
                        this.highcharts.renderCartesianChart(defaultViewType as CartesianViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'polar':
                        this.highcharts.renderPolarChart(defaultViewType as PolarViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'range':
                        this.highcharts.renderRangeChart(defaultViewType as RangeViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'values':
                        this.dataTable.render(defaultViewType as ValuesViewType, visualConfig.content, viewContainerElement);
                        break;
                }
            } catch (error) {
                console.error(error);
                visualElements.textContent = 'Invalid options.';
            }
        }
    }
}
