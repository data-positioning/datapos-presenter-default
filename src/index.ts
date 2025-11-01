// Dependencies - Framework.
import { useDataTable } from './composers/useDataTable';
import { useHighcharts } from './composers/useHighcharts';
import type { Presenter, PresenterConfig, PresenterItemConfig, PresenterLocalisedConfig, PresenterTools } from '@datapos/datapos-shared';

// Dependencies - Data.
import config from '../config.json';
import configPresentations from '../configPresentations.json';

// Types
type VisualOptions = {
    content: VisualContentOptions;
    views: [CartesianCategory | RangeCategory | ValuesCategory];
};
export type VisualContentOptions = {
    title: { text: string };
    data: {
        name: string;
        categoryLabels: string[];
        measures: { id: string; name: string }[];
    };
};
type CartesianCategory = {
    category: { id: 'cartesian' };
    types: { id: 'area' | 'bar' | 'column' | 'line' | 'radar'; default?: boolean }[];
};
type RangeCategory = {
    category: { id: 'range' };
    types: { id: 'bar' | 'column'; default?: boolean }[];
};
type ValuesCategory = {
    category: { id: 'values'; default?: boolean };
};

// Constants
const viewTypeMap: Record<string, { label: Record<string, string> }> = {
    cartesian_area: { label: { 'en-gb': 'Area' } },
    cartesian_bar: { label: { 'en-gb': 'Bar' } },
    cartesian_column: { label: { 'en-gb': 'Column' } },
    cartesian_line: { label: { 'en-gb': 'Line' } },
    cartesian_radar: { label: { 'en-gb': 'Radar' } },
    range_bar: { label: { 'en-gb': 'Range (Bar)' } },
    range_column: { label: { 'en-gb': 'Range (Column)' } },
    values: { label: { 'en-gb': 'Values' } }
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
                Object.assign(tabBarElement.style, { display: 'flex', 'column-gap': '8px' });
                const viewContainerElement = document.createElement('div');
                let defaultCategory = undefined;
                let defaultType = undefined;
                for (const view of visualOptions.views) {
                    const category = view.category;
                    switch (category.id) {
                        case 'cartesian':
                            for (const type of (view as CartesianCategory).types) {
                                if (!defaultType || type.default) {
                                    defaultCategory = category;
                                    defaultType = type;
                                }
                                const element = document.createElement('div');
                                element.textContent = viewTypeMap[`${category.id}_${type.id}`].label['en-gb'];
                                element.addEventListener('click', () => this.highcharts.renderCartesianChart(type, visualOptions.content, viewContainerElement));
                                tabBarElement.appendChild(element);
                            }
                            break;
                        case 'range':
                            for (const type of (view as RangeCategory).types) {
                                if (!defaultType || type.default) {
                                    defaultCategory = category;
                                    defaultType = type;
                                }
                                const element = document.createElement('div');
                                element.textContent = viewTypeMap[`${category.id}_${type.id}`].label['en-gb'];
                                element.addEventListener('click', () => this.highcharts.renderRangeChart(type, visualOptions.content, viewContainerElement));
                                tabBarElement.appendChild(element);
                            }
                            break;
                        case 'values':
                            if (!defaultType) {
                                defaultCategory = category;
                                defaultType = undefined;
                            }
                            const element = document.createElement('div');
                            element.textContent = viewTypeMap[category.id].label['en-gb'];
                            element.addEventListener('click', () => this.dataTable.render(visualOptions.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                    }
                }
                visualElements.appendChild(tabBarElement);
                visualElements.appendChild(viewContainerElement);
                if (defaultCategory.id === 'values') {
                    this.dataTable.render(visualOptions.content, viewContainerElement);
                } else {
                    this.highcharts.renderCartesianChart(defaultType, visualOptions.content, viewContainerElement);
                }
            } catch (error) {
                console.error(error);
                visualElements.textContent = 'Invalid options.';
            }
        }
    }
}
