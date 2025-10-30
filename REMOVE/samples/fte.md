---
title: Full-Time Equivalent Headcount
---

<script setup>
import { onMounted, ref } from 'vue';
import { useMainStore } from '@/stores/mainStore';
import SubHeader from '@/components_V1/SubHeader.vue';
import VisualContainer from '@/components_V1/VisualContainer.vue';

import { buildMeasureMap, monthAbbreviations, headcountForCalendarYear } from '@/helpers/dataHelpers';

import { buildDefaultChart, buildDefaultChartTitle } from '@/helpers/highchartsHelpers';
import { buildDefaultLegend, buildDefaultColumnChartLegend } from '@/helpers/highchartsHelpers';
import { buildDefaultSeries } from '@/helpers/highchartsHelpers';
import { buildDefaultXAxis, buildDefaultYAxis } from '@/helpers/highchartsHelpers';
import { buildAreaBaseRange, buildAreaDeclineRange, buildAreaIncreaseRange, render, renderRangeConnectors } from '@/helpers/highchartsHelpers';

import { Colors, SeriesColors } from '@/helpers/viewHelpers';

const mainStore = useMainStore();

mainStore.workbenchTitle = frontmatter.title;

const fteHeadcountView = ref(null);
const measureValueMap = buildMeasureMap(headcountForCalendarYear.months, [
    { id: "openingHeadcount" },
    { id: "startingHeadcount", source: (row) => row.openingHeadcount + row.startingHires },
    { id: "endingHeadcount", source: (row) => row.closingHeadcount + row.endingTerminations },
    { id: "closingHeadcount" },
    { id: "openingClosingBaseHeadcounts", source: (row) => buildAreaBaseRange(row.openingHeadcount, row.closingHeadcount) },
    { id: "openingClosingIncreaseHeadcounts", source: (row) => buildAreaIncreaseRange(row.openingHeadcount, row.closingHeadcount) },
    { id: "openingClosingDecreaseHeadcounts", source: (row) => buildAreaDeclineRange(row.openingHeadcount, row.closingHeadcount) },
    { id: "averageHeadcount" },
    { id: "fte" }
]);

const fteHeadcountConfigs = [
    { id: 'values', label: 'Values', populate: async (container) =>
        render(container || fteHeadcountView.value, {
            chart: buildDefaultChart('line'),
            legend: buildDefaultLegend(),
            plotOptions: { series: { threshold: null }},
            series: [
                buildDefaultSeries('FTE', SeriesColors[0], measureValueMap.fte),
            ],
            title: buildDefaultChartTitle(`FTE Headcount by Month for ${headcountForCalendarYear.year}`),
            xAxis: buildDefaultXAxis(monthAbbreviations),
            yAxis: buildDefaultYAxis() 
        })
    },
    { id: 'range', label: 'Range', populate: async (container) =>
        render(container || fteHeadcountView.value, {
            chart: buildDefaultChart('area'),
            legend: buildDefaultLegend(),
            plotOptions: {
                area: { stacking: true },
                series: { threshold: null
            }},
            series: [
                { ...buildDefaultSeries('O/C Increase', Colors.positive, measureValueMap.openingClosingIncreaseHeadcounts), lineWidth: 0, marker: { enabled: false } },
                { ...buildDefaultSeries('O/C Decrease', Colors.negative, measureValueMap.openingClosingDecreaseHeadcounts), lineWidth: 0, marker: { enabled: false } },
                { ...buildDefaultSeries('Base', Colors.transparent, measureValueMap.openingClosingBaseHeadcounts), showInLegend: false },
                { ...buildDefaultSeries('Average', SeriesColors[3], measureValueMap.averageHeadcount), type: 'line' },
                { ...buildDefaultSeries('FTE', SeriesColors[4], measureValueMap.fte), type: 'line' }
            ],
            title: buildDefaultChartTitle(`FTE Headcount by Month for ${headcountForCalendarYear.year}`),
            xAxis: buildDefaultXAxis(monthAbbreviations),
            yAxis: buildDefaultYAxis() 
        })
    }
];


onMounted(() => void (mainStore.hideWorkbenchMask()));
</script>

# {{ frontmatter.title }}

<SubHeader text="Human Resources - Workforce" />

...

<VisualContainer class="datapos-default" :configs="fteHeadcountConfigs">
    <template #default="{ activeTabId }">
        <div v-if="activeTabId === 'values'" ref="fteHeadcountView" style="height: 100%" />
        <div v-if="activeTabId === 'range'" ref="fteHeadcountView" style="height: 100%" />
    </template>
</VisualContainer>
