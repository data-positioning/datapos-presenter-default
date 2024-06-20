// Dependencies - Vendor
import type { Chart, Options, SeriesOptionsType } from 'highcharts';

// Dependencies - Framework
import { buildChartOptions, buildLegendOptions, buildSubtitleOptions, buildTitleOptions, buildXAxisOptions, buildYAxisOptions } from './highchartsFacilitators';
import type { IBasicChartOptions, IPresentationData, IPresentationItem, IPresentationItemConfig } from './moveToShareCore';
import { identifyRenderToElement, parseMarkdownToHTML } from './uiFacilitators';
import { renderChart, setAxisExtremes } from './highchartsFacilitators';

// Class - Presentation Item
export default class PresentationItem implements IPresentationItem {
    readonly label: Record<string, string>;
    readonly prefix: Record<string, string>;
    readonly suffix: Record<string, string>;
    readonly typeId: string;
    readonly options: Record<string, unknown>;
    chart: Chart | undefined = undefined;

    constructor(config: IPresentationItemConfig) {
        this.label = config.label || { en: '' };
        this.prefix = config.prefix || { en: '' };
        this.suffix = config.suffix || { en: '' };
        this.typeId = config.typeId;
        this.options = config.options || {};
    }

    renderPrefix(renderTo: string | HTMLElement | null, localeId: string = 'en'): void {
        const renderToElement = identifyRenderToElement(renderTo);
        const text = this.prefix[localeId] || '';
        if (renderToElement && text) parseMarkdownToHTML(renderToElement, text);
    }

    renderSuffix(renderTo: string | HTMLElement | null, localeId: string = 'en'): void {
        const renderToElement = identifyRenderToElement(renderTo);
        const text = this.suffix[localeId] || '';
        if (renderToElement && text) parseMarkdownToHTML(renderToElement, text);
    }

    renderTitle(renderTo: string | HTMLElement | null, localeId: string = 'en'): string {
        const renderToElement = identifyRenderToElement(renderTo);
        const title = this.label[localeId] || '';
        if (renderToElement && title) renderToElement.replaceChildren(document.createTextNode(title));
        return title;
    }

    async renderVisual(data: IPresentationData, renderTo: string | HTMLElement | null, localeId: string = 'en'): Promise<void> {
        const renderToElement = identifyRenderToElement(renderTo);
        if (!renderToElement) return;
        switch (this.typeId) {
            case 'basicChart': {
                this.chart = await renderChart(renderToElement, this.buildBasicChartOptions(this.options as IBasicChartOptions, data));
                setAxisExtremes(this.chart);
            }
        }
    }

    resize() {
        if (this.chart) this.chart.reflow();
    }

    update() {}

    private buildBasicChartOptions(options: IBasicChartOptions, data: IPresentationData): Options {
        return {
            chart: buildChartOptions(options.typeId, options.isPolar),
            title: buildTitleOptions(this.label.en),
            subtitle: buildSubtitleOptions('by Month for 2023'),
            xAxis: buildXAxisOptions(
                data.dimensions.intervals.map((interval) => interval.label),
                'Periods'
            ),
            yAxis: buildYAxisOptions('Headcount'),
            legend: buildLegendOptions(),
            series: data.measures.map(
                (series) => ({ color: undefined, data: series.values, name: series.label, type: series.typeId !== options.typeId ? series.typeId : undefined }) as SeriesOptionsType
            )
        };
    }
}
