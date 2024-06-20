---
title: Average Headcount
---

<script setup>
import { onMounted, ref } from 'vue';
import SubHeader from '@/components_V1/SubHeader.vue';
import { useMainStore } from '@/stores/mainStore';
import VisualContainer from '@/components_V1/VisualContainer.vue';

import { buildMeasureMap, monthAbbreviations, headcountForCalendarYear } from '@/helpers/dataHelpers';

import { buildDefaultChart, buildDefaultChartTitle } from '@/helpers/highchartsHelpers';
import { buildDefaultLegend, buildDefaultColumnChartLegend } from '@/helpers/highchartsHelpers';
import { buildDefaultSeries } from '@/helpers/highchartsHelpers';
import { buildDefaultXAxis, buildDefaultYAxis } from '@/helpers/highchartsHelpers';
import { buildBarRange, render, renderRangeConnectors } from '@/helpers/highchartsHelpers';

import { Colors, SeriesColors } from '@/helpers/viewHelpers';

const mainStore = useMainStore();

mainStore.workbenchTitle = frontmatter.title;

const averageHeadcountView = ref(null);
const measureValueMap = buildMeasureMap(headcountForCalendarYear.months, [
    { id: "openingHeadcount" },
    { id: "startingHeadcount", source: (row) => row.openingHeadcount + row.startingHires },
    { id: "endingHeadcount", source: (row) => row.closingHeadcount + row.endingTerminations },
    { id: "closingHeadcount" },
    { id: "average", source: (row) => (row.openingHeadcount + row.closingHeadcount) / 2 },
    { id: "averageHeadcount" }
]);

const averageHeadcountConfigs = [
    { id: 'values', label: 'Values', populate: async (container) =>
        render(container || averageHeadcountView.value, {
            chart: buildDefaultChart('line'),
            legend: buildDefaultLegend(),
            plotOptions: { series: { threshold: null }},
            series: [
                buildDefaultSeries('Average Headcount', SeriesColors[0], measureValueMap.averageHeadcount),
            ],
            title: buildDefaultChartTitle(`Average Headcount by Month for ${headcountForCalendarYear.year}`),
            xAxis: buildDefaultXAxis(monthAbbreviations),
            yAxis: buildDefaultYAxis() 
        })
    },
    { id: 'range', label: 'Range', populate: async (container) =>
        render(container || averageHeadcountView.value, {
            chart: buildDefaultChart('line'),
            legend: buildDefaultLegend(),
            plotOptions: { series: { threshold: null }},
            series: [
                buildDefaultSeries('Opening', SeriesColors[0], measureValueMap.openingHeadcount),
                buildDefaultSeries('Closing', SeriesColors[1], measureValueMap.closingHeadcount),
                buildDefaultSeries('Simple Average', SeriesColors[2], measureValueMap.average),
                buildDefaultSeries('Rolling Average', SeriesColors[3], measureValueMap.averageHeadcount),
            ],
            title: buildDefaultChartTitle(`Average Headcount by Month for ${headcountForCalendarYear.year}`),
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

<VisualContainer class="datapos-default" :configs="averageHeadcountConfigs">
    <template #default="{ activeTabId }">
        <div v-if="activeTabId === 'values'" ref="averageHeadcountView" style="height: 100%" />
        <div v-if="activeTabId === 'range'" ref="averageHeadcountView" style="height: 100%" />
    </template>
</VisualContainer>
