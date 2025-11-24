/**
 * Default presenter class.
 */

// Dependencies - Framework.
import { useDataTable } from '@datapos/datapos-shared';
import type {
    ColorModeId,
    ComponentRef,
    PresentationCartesianTypeId,
    PresentationPolarTypeId,
    PresentationRangeTypeId,
    PresentationVisualPeriodFlowBoundariesChartViewConfig,
    PresentationVisualValueTableViewConfig,
    ToolConfig
} from '@datapos/datapos-shared';
import type { PresentationConfig, PresentationVisualConfig } from '@datapos/datapos-shared';
import type { PresentationVisualCartesianChartViewConfig, PresentationVisualPolarChartViewConfig, PresentationVisualRangeChartViewConfig } from '@datapos/datapos-shared';
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
    readonly config: PresenterConfig; // TODO: If we remove list method, then config is not needed. Would make presenter slightly smaller.
    readonly valueTable;
    readonly sampleData;
    readonly toolModuleConfigs;

    highchartsTool?: HighchartsTool;
    micromarkTool?: MicromarkTool;

    constructor(toolModuleConfigs: ToolConfig[]) {
        this.config = config as PresenterConfig;
        this.valueTable = useDataTable();
        this.sampleData = useSampleData();
        this.toolModuleConfigs = toolModuleConfigs;
    }

    // Operations - List. TODO: Is this needed? Is 'configPresentations.json' needed????
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
        this.micromarkTool.highlight();

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
                let defaultCategoryId: string | undefined = undefined;
                let defaultTypeId: string | undefined = undefined;
                for (const viewConfig of visualConfig.views) {
                    const viewCategoryId = viewConfig.categoryId;
                    switch (viewCategoryId) {
                        case 'cartesianChart': {
                            const cartesianViewConfig = viewConfig as PresentationVisualCartesianChartViewConfig;
                            if (!defaultTypeId || cartesianViewConfig.default) {
                                defaultCategoryId = viewCategoryId;
                                defaultTypeId = cartesianViewConfig.typeId;
                            }
                            const element = document.createElement('div');
                            element.textContent = cartesianViewConfig.typeId;
                            element.addEventListener('click', () =>
                                this.highchartsTool.renderCartesianChart(cartesianViewConfig.typeId, visualConfig.content, viewContainerElement)
                            );
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'periodFlowBoundariesChart': {
                            const periodFlowBoundariesViewConfig = viewConfig as PresentationVisualPeriodFlowBoundariesChartViewConfig;
                            if (!defaultTypeId || periodFlowBoundariesViewConfig.default) {
                                defaultCategoryId = viewCategoryId;
                                defaultTypeId = undefined;
                            }
                            const element = document.createElement('div');
                            element.textContent = viewCategoryId;
                            element.addEventListener('click', () => this.highchartsTool.renderPeriodFlowBoundaries(visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'polarChart': {
                            const polarViewConfig = viewConfig as PresentationVisualPolarChartViewConfig;
                            if (!defaultTypeId || polarViewConfig.default) {
                                defaultCategoryId = viewCategoryId;
                                defaultTypeId = polarViewConfig.typeId;
                            }
                            const element = document.createElement('div');
                            element.textContent = polarViewConfig.typeId;
                            element.addEventListener('click', () => this.highchartsTool.renderPolarChart(polarViewConfig.typeId, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'rangeChart': {
                            const rangeViewConfig = viewConfig as PresentationVisualRangeChartViewConfig;
                            if (!defaultTypeId || rangeViewConfig.default) {
                                defaultCategoryId = viewCategoryId;
                                defaultTypeId = rangeViewConfig.typeId;
                            }
                            const element = document.createElement('div');
                            element.textContent = rangeViewConfig.typeId;
                            element.addEventListener('click', () => this.highchartsTool.renderRangeChart(rangeViewConfig.typeId, visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                        case 'valueTable': {
                            const valueTableViewConfig = viewConfig as PresentationVisualValueTableViewConfig;
                            if (!defaultTypeId || valueTableViewConfig.default) {
                                defaultCategoryId = viewCategoryId;
                                defaultTypeId = undefined;
                            }
                            const element = document.createElement('div');
                            element.textContent = viewCategoryId;
                            element.addEventListener('click', () => this.valueTable.render(visualConfig.content, viewContainerElement));
                            tabBarElement.appendChild(element);
                            break;
                        }
                    }
                }
                visualElements.appendChild(tabBarElement);
                visualElements.appendChild(viewContainerElement);
                switch (defaultCategoryId) {
                    case 'cartesianChart':
                        this.highchartsTool.renderCartesianChart(defaultTypeId as PresentationCartesianTypeId, visualConfig.content, viewContainerElement);
                        break;
                    case 'periodFlowBoundariesChart':
                        this.highchartsTool.renderPeriodFlowBoundaries(visualConfig.content, viewContainerElement);
                        break;
                    case 'polarChart':
                        this.highchartsTool.renderPolarChart(defaultTypeId as PresentationPolarTypeId, visualConfig.content, viewContainerElement);
                        break;
                    case 'rangeChart':
                        this.highchartsTool.renderRangeChart(defaultTypeId as PresentationRangeTypeId, visualConfig.content, viewContainerElement);
                        break;
                    case 'valueTable':
                        this.valueTable.render(visualConfig.content, viewContainerElement);
                        break;
                }
            } catch (error) {
                console.error(error);
                visualElements.textContent = 'Invalid options.';
            }
        }
    }

    // Operations - Set color mode.
    setColorMode(mode: ColorModeId) {
        if (this.micromarkTool) this.micromarkTool.switchTheme(mode);
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
