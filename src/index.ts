/**
 * Default presenter class.
 */

// Dependencies - Framework.
import { presentationViewTypeMap } from '@datapos/datapos-shared';
import { useDataTable } from '@datapos/datapos-shared';
import type { ComponentRef, ToolModuleConfig } from '@datapos/datapos-shared';
import type { PresentationConfig, PresentationVisualConfig, PresentationVisualViewType } from '@datapos/datapos-shared';
import type {
    PresentationVisualCartesianChartViewConfig,
    PresentationVisualPeriodFlowBoundariesChartViewConfig,
    PresentationVisualPolarChartViewConfig,
    PresentationVisualRangeChartViewConfig,
    PresentationVisualValueTableViewConfig
} from '@datapos/datapos-shared';
import type {
    PresentationVisualCartesianChartViewType,
    PresentationVisualPeriodFlowBoundariesChartViewType,
    PresentationVisualPolarChartViewType,
    PresentationVisualRangeChartViewType,
    PresentationVisualValueTableViewType
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
        // const chartJS = await import('chart.js');
        // console.log('chartJS', chartJS);

        // Substitute values for label and description placeholders in content.
        let processedMarkdown = presentation.content;
        processedMarkdown = processedMarkdown
            .replace(/\{\{label\}\}/g, presentation.label?.['en-gb'] ?? `{{label}}`)
            .replace(/\{\{description\}\}/g, presentation.description?.['en-gb'] ?? `{{description}}`);

        // Render markdown to HTML
        this.micromarkTool = await this.loadMicromarkTool();
        const html = this.micromarkTool.render(processedMarkdown);
        renderTo.innerHTML = html;

        // ????
        this.highchartsTool = await this.loadHighchartsTool();

        for (const visualElements of renderTo.querySelectorAll('.datapos-highcharts')) {
            const datasetOptions = decodeURIComponent((visualElements as HTMLElement).dataset.options);
            const options = JSON.parse(datasetOptions);
            const viewContainerElement = document.createElement('div');
            visualElements.appendChild(viewContainerElement);
            this.highchartsTool.render(options, viewContainerElement);
        }

        for (const visualElements of renderTo.querySelectorAll('.datapos-visual')) {
            const datasetOptions = decodeURIComponent((visualElements as HTMLElement).dataset.options);
            try {
                const visualConfig = JSON.parse(datasetOptions) as PresentationVisualConfig;

                if (!data) {
                    for (const measure of visualConfig.content.data.measures) {
                        measure.values = this.sampleData.getMeasureValues([measure.id]);
                    }
                }

                const tabBarElement = document.createElement('div');
                tabBarElement.className = 'dp-tab-bar';
                const viewContainerElement = document.createElement('div');
                let defaultViewType: PresentationVisualViewType | undefined = undefined;
                for (const viewConfig of visualConfig.views) {
                    const viewCategoryId = viewConfig.categoryId;
                    switch (viewCategoryId) {
                        case 'cartesianChart': {
                            const cartesianViewConfig = viewConfig as PresentationVisualCartesianChartViewConfig;
                            const viewType = presentationViewTypeMap[`${viewCategoryId}_${cartesianViewConfig.typeId}`] as PresentationVisualCartesianChartViewType;
                            if (!viewType) {
                                console.log(`${viewCategoryId}_${cartesianViewConfig.typeId}`);
                                break;
                            }
                            if (!defaultViewType || cartesianViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highchartsTool.renderCartesianChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'periodFlowBoundariesChart': {
                            const polarViewConfig = viewConfig as PresentationVisualPeriodFlowBoundariesChartViewConfig;
                            const viewType = presentationViewTypeMap[viewCategoryId] as PresentationVisualPeriodFlowBoundariesChartViewType;
                            if (!viewType) {
                                console.log(viewCategoryId);
                                break;
                            }
                            if (!defaultViewType || polarViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highchartsTool.renderPeriodFlowBoundaries(visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'polarChart': {
                            const polarViewConfig = viewConfig as PresentationVisualPolarChartViewConfig;
                            const viewType = presentationViewTypeMap[`${viewCategoryId}_${polarViewConfig.typeId}`] as PresentationVisualPolarChartViewType;
                            if (!viewType) {
                                console.log(`${viewCategoryId}_${polarViewConfig.typeId}`);
                                break;
                            }
                            if (!defaultViewType || polarViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highchartsTool.renderPolarChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'rangeChart': {
                            const rangeViewConfig = viewConfig as PresentationVisualRangeChartViewConfig;
                            const viewType = presentationViewTypeMap[`${viewCategoryId}_${rangeViewConfig.typeId}`] as PresentationVisualRangeChartViewType;
                            if (!viewType) {
                                console.log(`${viewCategoryId}_${rangeViewConfig.typeId}`);
                                break;
                            }
                            if (!defaultViewType || rangeViewConfig.default) defaultViewType = viewType;
                            const element = document.createElement('div');
                            element.textContent = viewType.label['en-gb'];
                            element.addEventListener('click', () => this.highchartsTool.renderRangeChart(viewType, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'valueTable': {
                            const valuesViewConfig = viewConfig as PresentationVisualValueTableViewConfig;
                            const viewType = presentationViewTypeMap[viewCategoryId] as PresentationVisualValueTableViewType;
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
                    case 'cartesianChart':
                        this.highchartsTool.renderCartesianChart(defaultViewType as PresentationVisualCartesianChartViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'periodFlowBoundariesChart':
                        this.highchartsTool.renderPeriodFlowBoundaries(visualConfig.content, viewContainerElement);
                        break;
                    case 'polarChart':
                        this.highchartsTool.renderPolarChart(defaultViewType as PresentationVisualPolarChartViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'rangeChart':
                        this.highchartsTool.renderRangeChart(defaultViewType as PresentationVisualRangeChartViewType, visualConfig.content, viewContainerElement);
                        break;
                    case 'valueTable':
                        this.dataTable.render(defaultViewType as PresentationVisualValueTableViewType, visualConfig.content, viewContainerElement);
                        break;
                }
            } catch (error) {
                console.error(error);
                visualElements.textContent = 'Invalid options.';
            }
        }
    }

    // Utilities - Load Highcharts tool.
    private async loadHighchartsTool(): Promise<HighchartsTool> {
        if (this.highchartsTool) return this.highchartsTool;

        const toolModuleConfig = this.toolModuleConfigs.find((config) => config.id === 'datapos-tool-highcharts');
        if (!toolModuleConfig) return;

        const url = `https://engine-eu.datapos.app/tools/highcharts_v${toolModuleConfig.version}/datapos-tool-highcharts.es.js`;
        const HighchartsTool = (await import(/* @vite-ignore */ url)).HighchartsTool as new () => HighchartsTool;
        return new HighchartsTool();
    }

    // Utilities - Load Micromark tool.
    private async loadMicromarkTool(): Promise<MicromarkTool> {
        if (this.micromarkTool) return this.micromarkTool;

        const toolModuleConfig = this.toolModuleConfigs.find((config) => config.id === 'datapos-tool-micromark');
        if (!toolModuleConfig) return;

        const url = `https://engine-eu.datapos.app/tools/micromark_v${toolModuleConfig.version}/datapos-tool-micromark.es.js`;
        const MicromarkToolConstructor = (await import(/* @vite-ignore */ url)).MicromarkTool as new () => MicromarkTool;
        return new MicromarkToolConstructor();
    }
}
