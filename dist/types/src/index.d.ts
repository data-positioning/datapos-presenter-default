import { ComponentRef, ToolConfig, Presenter, PresenterConfig } from '@datapos/datapos-shared';
import { MicromarkTool } from '@datapos/datapos-tool-micromark';
import { HighchartsTool } from '@datapos/datapos-tool-highcharts';
import { default as configPresentations } from '../configPresentations.json';
export default class DefaultPresenter implements Presenter {
    readonly config: PresenterConfig;
    colorModeId: string;
    readonly valueTable: {
        render: (contentConfig: import('@datapos/datapos-shared').PresentationVisualContentConfig, element: HTMLElement) => void;
    };
    readonly sampleData: {
        getMeasureValues: (ids: string[]) => number[][];
    };
    readonly toolConfigs: ToolConfig[];
    highchartsTool?: HighchartsTool;
    micromarkTool?: MicromarkTool;
    constructor(toolConfigs: ToolConfig[], colorModeId: string);
    list(): ComponentRef[];
    render(presentationPath: keyof typeof configPresentations, renderTo: HTMLElement, data?: unknown): Promise<void>;
    setColorMode(id: string): void;
    private loadHighchartsTool;
    private loadMicromarkTool;
}
