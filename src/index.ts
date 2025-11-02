// Dependencies - Framework.
import { useDataTable } from '@/composers/useDataTable';
import { useHighcharts } from '@/composers/useHighcharts';
import type { Presenter, PresenterConfig, PresenterItemConfig, PresenterLocalisedConfig, PresenterTools } from '@datapos/datapos-shared';

// Dependencies - Data.
import config from '~/config.json';
import configPresentations from '~/configPresentations.json';

// Types
type VisualOptions = { content: VisualContentOptions; views: [CartesianViewCategory | PolarViewCategory | RangeViewCategory | ValuesViewCategory] };
export type VisualContentOptions = { title: { text: string }; data: { name: string; categoryLabels: string[]; measures: { id: string; name: string }[] } };
type CartesianViewCategory = { category: { id: 'cartesian' }; types: { id: 'area' | 'bar' | 'column' | 'line'; default?: boolean }[] };
type PolarViewCategory = { category: { id: 'polar' }; types: { id: 'area' | 'column' | 'line'; default?: boolean }[] };
type RangeViewCategory = { category: { id: 'range' }; types: { id: 'bar' | 'column'; default?: boolean }[] };
type ValuesViewCategory = { category: { id: 'values'; default?: boolean } };
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
    polar_area: { label: { 'en-gb': 'Radar (Area)' }, options: { highchartsType: 'area' } },
    polar_column: { label: { 'en-gb': 'Radar (Column)' }, options: { highchartsType: 'column' } },
    polar_line: { label: { 'en-gb': 'Radar (Line)' }, options: { highchartsType: 'line' } },
    range_area: { label: { 'en-gb': 'Range (Area)' }, options: { highchartsType: 'arearange' } },
    range_bar: { label: { 'en-gb': 'Range (Bar)' }, options: { highchartsType: 'columnrange', inverted: true } },
    range_column: { label: { 'en-gb': 'Range (Column)' }, options: { highchartsType: 'columnrange' } },
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
        // Use presentation path to retrieve presentation.
        const presentation = configPresentations[presentationPath];

        // Substitute arguments in content.
        const processedMarkdown = presentation.content.replace(/\{\{(\w+)\}\}/g, (_, key: keyof typeof presentation.attributes) => {
            switch (key) {
                case 'label':
                    return presentation.attributes[key]['en-gb'] ?? `{{${key}}}`;
                case 'description':
                    return presentation.attributes[key]['en-gb'] ?? `{{${key}}}`;
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
                case 'datapos-visual': {
                    return `<div class="${typeId}" data-options="${encodeURIComponent(content)}"></div>`;
                }
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
