---
title: Hires & Terminations
---

<script setup>
import { color } from 'highcharts';

import { onMounted, ref } from 'vue';
import SubHeader from '@/components_V1/SubHeader.vue';
import { useMainStore } from '@/stores/mainStore';
import VisualContainer from '@/components_V1/VisualContainer.vue';

import { buildDefaultChart, buildDefaultChartSubTitle, buildDefaultChartTitle } from '@/helpers/highchartsHelpers';
import { buildDefaultLegend, buildDefaultColumnChartLegend } from '@/helpers/highchartsHelpers';
import { buildDefaultSeries } from '@/helpers/highchartsHelpers';
import { buildDefaultXAxis, buildDefaultYAxis } from '@/helpers/highchartsHelpers';
import { Highcharts, render } from '@/helpers/highchartsHelpers';

import { buildMeasureMap, buildProgressionData, buildWaterfallData, monthAbbreviations, headcountForCalendarYear } from '@/helpers/dataHelpers';

import { Colors, SeriesColors } from '@/helpers/viewHelpers';

const mainStore = useMainStore();

mainStore.workbenchTitle = frontmatter.title;
const hiresView = ref(null);
const hiresTermsView = ref(null);
const measureValueMap = buildMeasureMap(headcountForCalendarYear.months, [
    { id: "hires" },
    { id: "newHires" },
    { id: "rehires" },
    { id: "terminations" },
    { id: "averageHeadcount" }
]);
const progressionView1 = ref(null);
const progressionView2 = ref(null);

const progressionData1 = buildProgressionData();
const progressionData2 = buildWaterfallData();

const hiresConfigs = [
    { id: 'values', label: 'Values', populate: async (container) =>
        render(container || hiresView.value, {
            chart: { animation: false, reflow: false, style: { fontSize: '1em' } },
            legend: {
                itemStyle: { fontSize: '0.875em', fontWeight: 'normal' },
                symbolRadius: 0
            },
            plotOptions: { series: { animation: false, grouping: false } },
            series: [
                { borderColor: '#BDBDBD', color: '#EEEEEE', data: measureValueMap.hires, name: 'Hires', pointPadding: 0.05, pointPlacement: 0, type: 'column' },
                { borderColor: '#66BB6A', color: '#C8E6C9', data: measureValueMap.newHires, name: 'New Hires', pointPadding: 0.25, pointPlacement: -0.2, type: 'column' },
                { borderColor: '#E7C000', color: '#FFF7D4', data: measureValueMap.rehires, name: 'Rehires', pointPadding: 0.25, pointPlacement: 0.2, type: 'column' },
                { color: '#2196F3', data: measureValueMap.averageHeadcount, name: 'Average Headcount', type: 'line', yAxis: 1 }
            ],
            title: {
                style: { fontSize: '1.125em' },
                text: `Hires by Month for ${headcountForCalendarYear.year}`
            },
            xAxis: [{ categories: monthAbbreviations, labels: { style: { fontSize: '0.875em' } } }],
            yAxis: [
                { labels: { format: '{value:,.0f}', style: { fontSize: '0.875em' } }, title: { text: 'Hires' } },
                { labels: { format: '{value:,.0f}', style: { fontSize: '0.875em' } }, opposite: true, title: { text: 'Headcount' } }
            ]
        })
    },
    { id: 'stacked', label: 'Stacked', populate: async (container) =>
        render(container || hiresView.value, {
            chart: { animation: false, reflow: false, style: { fontSize: '1em' } },
            legend: {
                itemStyle: { fontSize: '0.875em', fontWeight: 'normal' },
                symbolRadius: 0
            },
            plotOptions: { series: { animation: false, stacking: 'normal' } },
            series: [
                { borderColor: '#66BB6A', color: '#C8E6C9', data: measureValueMap.newHires, name: 'New Hires', type: 'column' },
                { borderColor: '#E7C000', color: '#FFF7D4', data: measureValueMap.rehires, name: 'Rehires', type: 'column' },
                { color: '#78909C', data: measureValueMap.rehireRatio, name: 'Rehire Ratio', type: 'line', yAxis: 1 }
            ],
            title: {
                style: { fontSize: '1.125em' },
                text: `Hires by Month for ${headcountForCalendarYear.year}`
            },
            xAxis: [{ categories: monthAbbreviations, labels: { style: { fontSize: '0.875em' } } }],
            yAxis: [
                { labels: { format: '{value:,.0f}', style: { fontSize: '0.875em' } }, reversedStacks: false, title: { text: 'Hires' } },
                { labels: { format: '{value:,.0f}', style: { fontSize: '0.875em' } }, opposite: true, title: { text: 'Ratio' } }
            ]
        })
    },
    { id: 'stream', label: 'Stream', populate: async (container) =>
        render(container || hiresView.value, {
            chart: { type: 'streamgraph', marginBottom: 30, zoomType: 'x' },

            // Make sure connected countries have similar colors
            colors: [
                Highcharts.getOptions().colors[0],
                Highcharts.getOptions().colors[1],
                Highcharts.getOptions().colors[2],
                Highcharts.getOptions().colors[3],
                Highcharts.getOptions().colors[4],
                // East Germany, West Germany and Germany
                Highcharts.color(Highcharts.getOptions().colors[5]).brighten(0.2).get(),
                Highcharts.color(Highcharts.getOptions().colors[5]).brighten(0.1).get(),
                Highcharts.getOptions().colors[5],
                Highcharts.getOptions().colors[6],
                Highcharts.getOptions().colors[7],
                Highcharts.getOptions().colors[8],
                Highcharts.getOptions().colors[9],
                Highcharts.getOptions().colors[0],
                Highcharts.getOptions().colors[1],
                Highcharts.getOptions().colors[3],
                // Soviet Union, Russia
                Highcharts.color(Highcharts.getOptions().colors[2]).brighten(-0.1).get(),
                Highcharts.color(Highcharts.getOptions().colors[2]).brighten(-0.2).get(),
                Highcharts.color(Highcharts.getOptions().colors[2]).brighten(-0.3).get()
            ],

            title: { floating: true, align: 'left', text: 'Winter Olympic Medal Wins' },
            subtitle: { floating: true, align: 'left', y: 30, text: 'Source: <a href="https://www.sports-reference.com/olympics/winter/1924/">sports-reference.com</a>' },

            xAxis: {
                maxPadding: 0,
                type: 'category',
                crosshair: true,
                categories: [
                    '',
                    '1924 Chamonix',
                    '1928 St. Moritz',
                    '1932 Lake Placid',
                    '1936 Garmisch-Partenkirchen',
                    '1940 <i>Cancelled (Sapporo)</i>',
                    "1944 <i>Cancelled (Cortina d'Ampezzo)</i>",
                    '1948 St. Moritz',
                    '1952 Oslo',
                    "1956 Cortina d'Ampezzo",
                    '1960 Squaw Valley',
                    '1964 Innsbruck',
                    '1968 Grenoble',
                    '1972 Sapporo',
                    '1976 Innsbruck',
                    '1980 Lake Placid',
                    '1984 Sarajevo',
                    '1988 Calgary',
                    '1992 Albertville',
                    '1994 Lillehammer',
                    '1998 Nagano',
                    '2002 Salt Lake City',
                    '2006 Turin',
                    '2010 Vancouver',
                    '2014 Sochi'
                ],
                labels: { align: 'left', reserveSpace: false, rotation: 270 },
                lineWidth: 0,
                margin: 20,
                tickWidth: 0
            },

            yAxis: { visible: false, startOnTick: false, endOnTick: false },

            legend: { enabled: false },

            annotations: [
                {
                    labels: [
                        { point: { x: 5.5, xAxis: 0, y: 30, yAxis: 0 }, text: 'Cancelled<br>during<br>World War II' },
                        { point: { x: 18, xAxis: 0, y: 90, yAxis: 0 }, text: 'Soviet Union fell,<br>Germany united' }
                    ],
                    labelOptions: { backgroundColor: 'rgba(255,255,255,0.5)', borderColor: 'silver' }
                }
            ],

            plotOptions: {
                series: { label: { minFontSize: 5, maxFontSize: 15, style: { color: 'rgba(255,255,255,0.75)' } }, accessibility: { exposeAsGroupOnly: true } }
            },

            // Data parsed with olympic-medals.node.js
            series: [
                { name: 'Finland', data: [0, 11, 4, 3, 6, 0, 0, 6, 9, 7, 8, 10, 5, 5, 7, 9, 13, 7, 7, 6, 12, 7, 9, 5, 5] },
                { name: 'Austria', data: [0, 3, 4, 2, 4, 0, 0, 8, 8, 11, 6, 12, 11, 5, 6, 7, 1, 10, 21, 9, 17, 17, 23, 16, 17] },
                { name: 'Sweden', data: [0, 2, 5, 3, 7, 0, 0, 10, 4, 10, 7, 7, 8, 4, 2, 4, 8, 6, 4, 3, 3, 7, 14, 11, 15] },
                { name: 'Norway', data: [0, 17, 15, 10, 15, 0, 0, 10, 16, 4, 6, 15, 14, 12, 7, 10, 9, 5, 20, 26, 25, 25, 19, 23, 26] },
                { name: 'U.S.', data: [0, 4, 6, 12, 4, 0, 0, 9, 11, 7, 10, 7, 7, 8, 10, 12, 8, 6, 11, 13, 13, 34, 25, 37, 28] },
                { name: 'East Germany', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 14, 19, 23, 24, 25, 0, 0, 0, 0, 0, 0, 0] },
                { name: 'West Germany', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 5, 10, 5, 4, 8, 0, 0, 0, 0, 0, 0, 0] },
                { name: 'Germany', data: [0, 0, 1, 2, 6, 0, 0, 0, 7, 2, 8, 9, 0, 0, 0, 0, 0, 0, 26, 24, 29, 36, 29, 30, 19] },
                { name: 'Netherlands', data: [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 2, 9, 9, 6, 4, 0, 7, 4, 4, 11, 8, 9, 8, 24] },
                { name: 'Italy', data: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 4, 4, 5, 4, 2, 2, 5, 14, 20, 10, 13, 11, 5, 8] },
                { name: 'Canada', data: [0, 1, 1, 7, 1, 0, 0, 3, 2, 3, 4, 3, 3, 1, 3, 2, 4, 5, 7, 13, 15, 17, 24, 26, 25] },
                { name: 'Switzerland', data: [0, 3, 1, 1, 3, 0, 0, 10, 2, 6, 2, 0, 6, 10, 5, 5, 5, 15, 3, 9, 7, 11, 14, 9, 11] },
                { name: 'Great Britain', data: [0, 4, 1, 0, 3, 0, 0, 2, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 2, 1, 2, 1, 1, 4] },
                { name: 'France', data: [0, 3, 1, 1, 1, 0, 0, 5, 1, 0, 3, 7, 9, 3, 1, 1, 3, 2, 9, 5, 8, 11, 9, 11, 15] },
                { name: 'Hungary', data: [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { name: 'Unified Team', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0] },
                { name: 'Soviet Union', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 21, 25, 13, 16, 27, 22, 25, 29, 0, 0, 0, 0, 0, 0, 0] },
                { name: 'Russia', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 18, 13, 22, 15, 33] },
                { name: 'Japan', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 1, 1, 1, 7, 5, 10, 2, 1, 5, 8] },
                { name: 'Czechoslovakia', data: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 4, 3, 1, 1, 6, 3, 3, 0, 0, 0, 0, 0, 0] },
                { name: 'Poland', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 6, 6] },
                { name: 'Spain', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] },
                { name: 'China', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 8, 8, 11, 11, 9] },
                { name: 'South Korea', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 6, 4, 11, 14, 8] },
                { name: 'Czech Republic', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 4, 6, 8] },
                { name: 'Belarus', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 3, 6] },
                { name: 'Kazakhstan', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 1, 1] },
                { name: 'Bulgaria', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 3, 1, 0, 0] },
                { name: 'Denmark', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
                { name: 'Ukraine', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 2, 0, 2] },
                { name: 'Australia', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3] },
                { name: 'Belgium', data: [0, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
                { name: 'Romania', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { name: 'Liechtenstein', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0] },
                { name: 'Yugoslavia', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0] },
                { name: 'Luxembourg', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0] },
                { name: 'New Zealand', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] },
                { name: 'North Korea', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] },
                { name: 'Slovakia', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1] },
                { name: 'Croatia', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 3, 1] },
                { name: 'Slovenia', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 3, 8] },
                { name: 'Latvia', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4] },
                { name: 'Estonia', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 0] },
                { name: 'Uzbekistan', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0] }
            ],

            exporting: { sourceWidth: 800, sourceHeight: 600 }
        })
    }
];

const hiresTermsConfigs = [
    { id: 'values', label: 'Values', populate: async (container) =>
        render(container || hiresTermsView.value, {
            chart: buildDefaultChart('column'),
            legend: buildDefaultColumnChartLegend(),
            plotOptions: {
                series: {
                    groupPadding: 0.15,
                    pointPadding: 0.05,
                }
            },
            series: [
                { ...buildDefaultSeries('Hires', SeriesColors[0], measureValueMap.hires), borderRadius: 0},
                { ...buildDefaultSeries('Terminations', SeriesColors[1], measureValueMap.terminations), borderRadius: 0},
                { ...buildDefaultSeries('Average Headcount', SeriesColors[4], measureValueMap.averageHeadcount), type: 'line', yAxis: 1 }
            ],
            subtitle: buildDefaultChartSubTitle(`by Month for ${headcountForCalendarYear.year}`),
            title: buildDefaultChartTitle('Hires & Terminations'),
            xAxis: buildDefaultXAxis(monthAbbreviations),
            yAxis: [
                buildDefaultYAxis('Hires / Terminations'),
                { ...buildDefaultYAxis('Headcount'), opposite: true }
            ]
        })
    }
];

const progressionConfigs1 = [
    { id:'values', label:'Values', populate: async (container) =>
        render(container || progressionView1.value, {
            chart: buildDefaultChart('waterfall'),
            legend: { ...buildDefaultLegend(), symbolRadius: 0},
            plotOptions: {
                series: { animation: true, groupPadding: 0.2, pointPadding: 0.05 },
                waterfall: { dashStyle: 'solid', stacking: 'normal' }
            },
            series: [
                { ...buildDefaultSeries('Headcount', Colors.grey, progressionData1.broughtForwardHeadcounts1), borderRadius: 0, legendIndex: 0, lineWidth: 0, pointPadding: -0.4, pointPlacement: 0.15, stack: 0 },
                { ...buildDefaultSeries('Hires', Colors.positive, progressionData1.hires), borderRadius: 0, legendIndex: 1, lineWidth: 0, stack: 0 },
                { ...buildDefaultSeries(undefined, Colors.transparent, progressionData1.terminations), lineColor: Colors.grey.border, lineWidth: 1, showInLegend: false, stack: 0 },
                { ...buildDefaultSeries(undefined, Colors.grey, progressionData1.carryForwardHeadcounts1), borderRadius: 0, lineWidth: 0, pointPadding: -0.4, pointPlacement: 0.15, showInLegend: false, stack: 0 },
                { ...buildDefaultSeries(undefined, Colors.transparent, progressionData1.broughtForwardHeadcounts2), lineWidth: 0, showInLegend: false, stack: 1 },
                { ...buildDefaultSeries('Terminations', Colors.negative, progressionData1.terminations), borderRadius: 0, legendIndex: 2, lineWidth: 0, stack: 1 },
                { ...buildDefaultSeries(undefined, Colors.transparent, progressionData1.offsets), lineWidth: 0, showInLegend: false, stack: 1 },
                // { ...buildDefaultSeries('Closing Headcount', SeriesColors[0], progressionData1.openingHeadcount), legendIndex: 3, type: 'line' },
                // { ...buildDefaultSeries('Closing Headcount', SeriesColors[1], progressionData1.closingHeadcount), legendIndex: 4, type: 'line' },
                { ...buildDefaultSeries('Average Headcount', SeriesColors[4], progressionData1.averageHeadcounts), legendIndex: 3, type: 'line' }
            ],
            title: buildDefaultChartTitle(`Headcount Progression by Month for ${headcountForCalendarYear.year}`),
            // tooltip: {
            //     formatter: function (tooltip) {
            //         return buildTooltip(this);
            //     },
            //     shared: true,
            //     useHTML: true
            // },
            xAxis: { ...buildDefaultXAxis(['Open'].concat(monthAbbreviations.concat(['Close']))), crosshair: false },
            yAxis: { ...buildDefaultYAxis(), min: 1075 }
        })
    }
];

const progressionConfigs2 = [
    { id:'values', label:'Values', populate: async (container) =>
        render(container || progressionView2.value, {
            chart: {
                animation: false,
                reflow: false,
                style: { fontSize: '1em' },
                type: 'waterfall'
            },
            legend: {
                itemStyle: { fontSize: '0.875em', fontWeight: 'normal' },
                symbolRadius: 0
            },
            plotOptions: {
                series: { animation: false },
                waterfall: { stacking: 'normal' }
            },
            series: [
                { borderColor: '#BDBDBD', color: '#EEEEEE', data: progressionData2.openingHeadcounts1, legendIndex: 0, lineWidth: 2, name: 'Headcount', stack: 0 },
                { borderColor: '#FFA726', color: '#FFCC7F', data: progressionData2.endingTerminations, legendIndex: 4, lineWidth: 0, name: 'Terminations at End', stack: 0 },
                { borderColor: '#66BB6A', color: '#C8E6C9', data: progressionData2.hires, legendIndex: 2, lineWidth: 0, name: 'Hires During', stack: 0 },
                { borderColor: '#FFA726', color: '#FFFFFF', data: progressionData2.terminations, legendIndex: 3, lineWidth: 0, name: 'Terminations During', stack: 0 },
                { borderColor: '#66BB6A', color: '#A5D6A7', data: progressionData2.startingHires, legendIndex: 1, lineWidth: 0, name: 'Hires at Start', stack: 0 },
                { borderColor: '#BDBDBD', color: '#EEEEEE', data: progressionData2.closingHeadcounts, lineWidth: 0, name: 'Headcount', showInLegend: false, stack: 0 },
                { color: '#2196F3', data: progressionData2.averageHeadcounts, legendIndex: 5, name: 'Average Headcount', type: 'line' }
            ],
            title: {
                style: { fontSize: '1.125em' },
                text: `Change in Headcount by Month for ${headcountForCalendarYear.year}`
            },
            xAxis: [{ categories: ['Open'].concat(monthAbbreviations).concat(['Close']), labels: { style: { fontSize: '0.875em' } } }],
            yAxis: { labels: { format: '{value:,.0f}', style: { fontSize: '0.875em' } }, min: 1075, title: { text: 'Headcount' } }
        })
    }
];


onMounted(() => void (mainStore.hideWorkbenchMask()));
</script>

# {{ frontmatter.title }}

<SubHeader text="Human Resources - Workforce" />

People joining and leaving the workforce...

## Hires

New Hires & Rehires vs External & Internal Hires...

<VisualContainer class="datapos-wide" :configs="hiresConfigs">
    <template #default="{ activeTabId }">
        <div v-if="activeTabId === 'values'" ref="hiresView" style="height: 100%"/>
        <div v-if="activeTabId === 'stacked'" ref="hiresView" style="height: 100%" />
        <div v-if="activeTabId === 'stream'" ref="hiresView" style="height: 100%" />
    </template>
</VisualContainer>

## Hire Rate

...

## Terminations

...

## Termination Rate

...

## Headcount Progression

...

<VisualContainer class="datapos-wide" :configs="hiresTermsConfigs">
    <template #default="{ activeTabId }">
        <div ref="hiresTermsView" style="height: 100%"/>
    </template>
</VisualContainer>

<VisualContainer class="datapos-wide" :configs="progressionConfigs1">
    <template #default="{ activeTabId }">
        <div ref="progressionView1" style="height: 100%"/>
    </template>
</VisualContainer>

<VisualContainer class="datapos-wide" :configs="progressionConfigs2">
    <template #default="{ activeTabId }">
        <div ref="progressionView2" style="height: 100%"/>
    </template>
</VisualContainer>

## Net Growth Ratio

...

## Retention Rate

...
