// Interfaces/Types - Presentation - Basic Chart Series Type Id
type TBasicChartSeriesTypeId = 'areaLine' | 'areaSpline' | 'bar' | 'column' | 'line' | 'pyramid' | 'spline';

// Interfaces/Types - Presentation - Config - Set
export interface IPresentationSetConfig {
    id: string;
    label: Record<string, string>;
    items: IPresentationItemConfig[];
    presentationIndex: IPresentationItemConfig[];
}

// Interfaces/Types - Presentation - Config - Item
export interface IPresentationItemConfig {
    id?: string;
    items?: IPresentationItemConfig[];
    label?: Record<string, string>;
    path?: string;
    options?: IBasicChartOptions;
    prefix?: Record<string, string>;
    suffix?: Record<string, string>;
    typeId: 'basicChart' | 'folder' | 'presentation' | 'table' | 'text' | 'view';
}
export interface IBasicChartOptions extends Record<string, unknown> {
    isPolar: boolean;
    // series: { label: string; typeId: TBasicChartSeriesTypeId | undefined; values: number[] }[];
    typeId: TBasicChartSeriesTypeId;
}

// Interfaces/Types - Presentation - Instance - Presentation Set
export interface IPresentationSet {
    getPresentation(id: string): IPresentation | undefined;
    list(path?: string): IPresentationItemConfig[];
}

// Interfaces/Types - Presentation - Instance - Presentation
export interface IPresentation {
    readonly items: IPresentationItem[];
    readonly prefix: Record<string, string>;
    readonly label: Record<string, string>;
    readonly suffix: Record<string, string>;
    renderItems(data: IPresentationData, renderTo: string | HTMLElement | null, localeId?: string): Promise<void>;
    renderPrefix(renderTo: string | HTMLElement | null, localeId?: string): void;
    renderSuffix(renderTo: string | HTMLElement | null, localeId?: string): void;
    renderTitle(renderTo: string | HTMLElement | null, localeId?: string): string;
}

// Interfaces/Types - Presentation - Instance - Presentation Item
export interface IPresentationItem {
    readonly prefix: Record<string, string>;
    readonly label: Record<string, string>;
    readonly suffix: Record<string, string>;
    renderPrefix(renderTo: string | HTMLElement | null, localeId?: string): void;
    renderSuffix(renderTo: string | HTMLElement | null, localeId?: string): void;
    renderTitle(renderTo: string | HTMLElement | null, localeId?: string): string;
    renderVisual(data: IPresentationData, renderTo: string | HTMLElement | null, localeId?: string): Promise<void>;
    resize: () => void;
    update: () => void;
}

// Interfaces/Types - Presentation - Instance - Presentation - Data
export interface IPresentationData {
    dimensions: { id: string; type: { id: string; spanId?: string; intervalId?: string }; intervals: { label: string }[] };
    measures: { id: string; label: string; typeId?: TBasicChartSeriesTypeId; values: number[] }[];
}

// Interfaces/Types - Presentation - Instance - Presentation - Render Settings
export interface IPresentationRenderSettings {
    localeId?: string;
}
