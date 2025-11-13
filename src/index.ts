/**
 * Default presenter class.
 */

// Dependencies - Framework.
import type { ComponentRef, ToolModuleConfig } from '@datapos/datapos-shared';
import { presentationViewTypeMap } from '@datapos/datapos-shared';
import { useDataTable } from '@datapos/datapos-shared';
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
import type { Presenter, PresenterConfig, PresenterLocalisedConfig } from '@datapos/datapos-shared';

// Dependencies - Tools.
import type { MicromarkTool } from '@datapos/datapos-tool-micromark';
import type { HighchartsTool, HighchartsView } from '@datapos/datapos-tool-highcharts';

// Dependencies - Data.
import config from '~/config.json';
import configPresentations from '~/configPresentations.json';
import { useSampleData } from '@/composers/useSampleData';

// Classes - Default presenter.
export default class DefaultPresenter implements Presenter {
    readonly config: PresenterConfig;
    readonly dataTable;
    readonly sampleData;
    readonly toolModuleConfigs;

    highchartsTool?: HighchartsTool;
    micromarkTool?: MicromarkTool;

    constructor(toolModuleConfigs: ToolModuleConfig[]) {
        this.config = config as PresenterConfig;
        this.dataTable = useDataTable();
        this.sampleData = useSampleData();
        this.toolModuleConfigs = toolModuleConfigs;
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

        // Render markdown to HTML
        await this.loadMicromarkTool();
        const html = this.micromarkTool.render(processedMarkdown);
        renderTo.innerHTML = html;

        // ????
        await this.loadHighchartsTool();
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
                            element.addEventListener('click', () => this.highchartsTool.renderCartesianChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'polar': {
                            const polarViewConfig = viewConfig as PresentationVisualPolarViewConfig;
                            const viewType = presentationViewTypeMap[`${viewCategoryId}_${polarViewConfig.typeId}`] as PresentationVisualPolarViewType;
                            if (!defaultViewType || polarViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highchartsTool.renderPolarChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'range': {
                            const rangeViewConfig = viewConfig as PresentationVisualRangeViewConfig;
                            const viewType = presentationViewTypeMap[`${viewCategoryId}_${rangeViewConfig.typeId}`] as PresentationVisualRangeViewType;
                            if (!defaultViewType || rangeViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highchartsTool.renderRangeChart(viewType, visualConfig.content, viewContainerElement));
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
                        this.highchartsTool.renderCartesianChart(defaultViewType as PresentationVisualCartesianViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'polar':
                        this.highchartsTool.renderPolarChart(defaultViewType as PresentationVisualPolarViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'range':
                        this.highchartsTool.renderRangeChart(defaultViewType as PresentationVisualRangeViewType, visualConfig.content, viewContainerElement);
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

    // Utilities - Load Highcharts tool.
    private async loadHighchartsTool(): Promise<void> {
        if (this.highchartsTool) return;

        const toolModuleConfig = this.toolModuleConfigs.find((config) => (config.id = 'datapos-tool-highcharts'));
        if (!toolModuleConfig) return;

        const url = `https://engine-eu.datapos.app/tools/v${toolModuleConfig.version}/datapos-tool-highcharts.es.js`;
        const HighchartsTool = (await import(/* @vite-ignore */ url)).HighchartsTool as new () => HighchartsTool;
        this.highchartsTool = new HighchartsTool();
    }

    // Utilities - Load Micromark tool.
    private async loadMicromarkTool(): Promise<void> {
        if (this.micromarkTool) return;

        const toolModuleConfig = this.toolModuleConfigs.find((config) => (config.id = 'datapos-tool-micromark'));
        if (!toolModuleConfig) return;

        const url = `https://engine-eu.datapos.app/tools/v${toolModuleConfig.version}/datapos-tool-micromark.es.js`;
        const MicromarkToolConstructor = (await import(/* @vite-ignore */ url)).MicromarkTool as new () => MicromarkTool;
        this.micromarkTool = new MicromarkToolConstructor();
    }
}
