// Dependencies - Vendor
import type { Chart, Options, SeriesOptionsType } from 'highcharts';

// Dependencies - Framework
import { identifyRenderToElement } from '@/presentationSet/facilitators/uiFacilitators';
import { buildAreaOptions, buildBarOptions, buildColumnOptions, buildLineOptions, setAxisExtremes } from '@/presentationSet/facilitators/highchartsFacilitators';
import {
    buildChartOptions,
    buildLegendOptions,
    buildSubtitleOptions,
    buildTitleOptions,
    buildXAxisOptions,
    buildYAxisOptions
} from '@/presentationSet/facilitators/highchartsFacilitators';
import { type HighchartsChart, renderChart, VendorId } from '@/presentationSet/facilitators/highchartsFacilitators';
import type { IPresentationChartData, IPresentationItemConfig, IPresentationRenderSettings } from '@/presentationSet/moveToShareCore';

// Class - Workforce Physical Headcount Opening/Closing Values Chart
export default class WorkforcePhysicalHeadcountOpeningClosingValuesChart implements HighchartsChart {
    readonly renderToElement: HTMLElement;
    readonly config: IPresentationItemConfig;
    readonly typeId = 'chart';
    readonly vendorId = VendorId;
    readonly variants = [{ typeId: 'area' }, { typeId: 'bar' }, { typeId: 'column' }, { typeId: 'line' }, { typeId: 'line' }];
    chart: Chart | undefined = undefined;
    variantIndex: number | undefined = undefined;

    constructor(renderTo: string | HTMLElement, config: IPresentationItemConfig) {
        this.renderToElement = identifyRenderToElement(renderTo);
        this.config = config;
    }

    private buildOptions(data: IPresentationChartData): Options {
        return {
            chart: { ...buildChartOptions(this.typeId, false) },
            title: buildTitleOptions('Opening / Closing Headcount'),
            subtitle: buildSubtitleOptions('by Month for 2013'),
            xAxis: buildXAxisOptions(data.categories, 'Periods'),
            yAxis: buildYAxisOptions('Headcount'),
            legend: buildLegendOptions(),
            series: data.series.map((series) => this.buildSeriesOptions(variantIndex, series.label, series.values))
        };
    }

    private buildSeriesOptions(variantIndex: number, label: string, values: number[]): SeriesOptionsType {
        switch (variantIndex) {
            case 0:
                return buildAreaOptions(label, values, undefined, true);
            case 1:
                return buildBarOptions(label, values, undefined, undefined, true);
            case 2:
                return buildColumnOptions(label, values, undefined, undefined, true);
            case 3:
            case 4:
                return buildLineOptions(label, values, undefined, true);
            default:
                throw new Error('Invalid variant index for build series options.');
        }
    }

    async render(settings: IPresentationRenderSettings, data: IPresentationChartData, index: number = 0) {
        this.chart = await renderChart(this.renderToElement, this.buildOptions(data));
        setAxisExtremes(this.chart);
    }

    resize() {
        if (!this.chart) return;
        this.chart.reflow();
    }

    update(variantIndex: number) {
        if (!this.chart) return;
        this.chart.update({ chart: { type: this.variants[variantIndex].typeId, polar: variantIndex === 4 } });
        this.variantIndex = variantIndex;
    }
}
