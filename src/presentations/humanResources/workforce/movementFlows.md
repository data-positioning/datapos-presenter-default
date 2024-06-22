---
title: Movement Flows
---

<script setup>
import SubHeader from '@/components_V1/SubHeader.vue';
import { useMainStore } from '@/stores/mainStore';
import VisualContainer from '@/components_V1/VisualContainer.vue'
import { buildMeasureMap, monthAbbreviations, headcountForCalendarYear } from '@/helpers/dataHelpers';
import { onMounted, ref } from 'vue';

import { render as renderHighcharts } from '@/helpers/highchartsHelpers';
// import { render as renderVisNetwork } from '@/helpers/visNetworkHelpers';

const data = [
    { "source": "Brazil", "target": "Portugal", "value": 5 },
    { "source": "Brazil", "target": "France", "value": 1 },
    { "source": "Brazil", "target": "Spain", "value": 1 },
    { "source": "Brazil", "target": "England", "value": 1 },
    { "source": "Canada", "target": "Portugal", "value": 1 },
    { "source": "Canada", "target": "France", "value": 5 },
    { "source": "Canada", "target": "England", "value": 1 },
    { "source": "Mexico", "target": "Portugal", "value": 1 },
    { "source": "Mexico", "target": "France", "value": 1 },
    { "source": "Mexico", "target": "Spain", "value": 5 },
    { "source": "Mexico", "target": "England", "value": 1 },
    { "source": "USA", "target": "Portugal", "value": 1 },
    { "source": "USA", "target": "France", "value": 1 },
    { "source": "USA", "target": "Spain", "value": 1 },
    { "source": "USA", "target": "England", "value": 5 },
    { "source": "Portugal", "target": "Angola", "value": 2 },
    { "source": "Portugal", "target": "Senegal", "value": 1 },
    { "source": "Portugal", "target": "Morocco", "value": 1 },
    { "source": "Portugal", "target": "South Africa", "value": 3 },
    { "source": "France", "target": "Angola", "value": 1 },
    { "source": "France", "target": "Senegal", "value": 3 },
    { "source": "France", "target": "Mali", "value": 3 },
    { "source": "France", "target": "Morocco", "value": 3 },
    { "source": "France", "target": "South Africa", "value": 1 },
    { "source": "Spain", "target": "Senegal", "value": 1 },
    { "source": "Spain", "target": "Morocco", "value": 3 },
    { "source": "Spain", "target": "South Africa", "value": 1 },
    { "source": "England", "target": "Angola", "value": 1 },
    { "source": "England", "target": "Senegal", "value": 1 },
    { "source": "England", "target": "Morocco", "value": 2 },
    { "source": "England", "target": "South Africa", "value": 7 },
    { "source": "South Africa", "target": "China", "value": 5 },
    { "source": "South Africa", "target": "India", "value": 1 },
    { "source": "South Africa", "target": "Japan", "value": 3 },
    { "source": "Angola", "target": "China", "value": 5 },
    { "source": "Angola", "target": "India", "value": 1 },
    { "source": "Angola", "target": "Japan", "value": 3 },
    { "source": "Senegal", "target": "China", "value": 5 },
    { "source": "Senegal", "target": "India", "value": 1 },
    { "source": "Senegal", "target": "Japan", "value": 3 },
    { "source": "Mali", "target": "China", "value": 5 },
    { "source": "Mali", "target": "India", "value": 1 },
    { "source": "Mali", "target": "Japan", "value": 3 },
    { "source": "Morocco", "target": "China", "value": 5 },
    { "source": "Morocco", "target": "India", "value": 1 },
    { "source": "Morocco", "target": "Japan", "value": 3 },
    { "source": "Japan", "target": "Brazil", "value": 1 }
]

const mainStore = useMainStore();
mainStore.workbenchTitle = frontmatter.title;
onMounted(() => void (mainStore.hideWorkbenchMask()));

const chordDiagramView = ref(null);
const markovView = ref(null);
const sankeyDiagramView = ref(null);
 
const edges = [
    { arrowStrikethrough: false, arrows: { to: { enabled: true, type: 'arrow' } }, color: 'green', from: '1H', label: '3', length: 75, to: 1, value: 3 },
    { arrowStrikethrough: false, arrows: { to: { enabled: true, type: 'arrow' } }, color: 'orange', from: 1, label: '4', length: 75, to: '1T', value: 4 },
    { arrowStrikethrough: false, arrows: { to: { enabled: true, type: 'arrow' } }, color: 'green', from: '3H', label: '3', length: 75, to: 3, value: 3 },
    { arrowStrikethrough: false, arrows: { to: { enabled: true, type: 'arrow' } }, color: 'orange', from: 3, label: '4', length: 75, to: '3T', value: 4 },
    { arrows: { middle: { enabled: true, type: 'arrow' } }, from: 1, label: '1', to: 2, value: 1 },
    { arrows: { middle: { enabled: true, type: 'arrow' } }, from: 2, label: '2', to: 1, value: 2 },
    { arrows: { middle: { enabled: true, type: 'arrow' } }, from: 2, label: '3', to: 3, value: 3 },
    { arrows: { middle: { enabled: true, type: 'arrow' } }, from: 3, label: '4', to: 4, value: 4 },
    { arrows: { middle: { enabled: true, type: 'arrow' } }, from: 4, label: '5', to: 2, value: 5 },
    { color: 'brown', from: 4, label: '5', to: 4, value: 5 },
    { arrows: { middle: { enabled: true, type: 'arrow' } }, from: 4, label: '6', to: 5, value: 6 },
    { arrows: { middle: { enabled: true, type: 'arrow' } }, from: 5, label: '7', to: 4, value: 7 },
    { arrows: { middle: { enabled: true, type: 'arrow' } }, from: 5, label: '4', to: 6, value: 4 }
];

const nodes = [
    { fixed: true, id: 1, label: 'New York', value: 20 },
    { color: 'transparent', id: '1H', label: null, value: 0 },
    { color: 'transparent', id: '1T', label: null, value: 0 },
    { id: 2, label: 'Paris', margin: 10, value: 30 },
    { id: 3, label: 'Frankfurt', value: 40 },
    { color: 'transparent', id: '3H', label: null, value: 0 },
    { color: 'transparent', id: '3T', label: null, value: 0 },
    { id: 4, label: 'London 2', value: 20 },
    { id: 5, label: 'London 1', value: 60 },
    { id: 6, label: 'Madrid', value: 10 }
];

const options = {
    interaction: { navigationButtons: true, zoomView: false },
    nodes: {
        scaling: { label: { max: 20, min: 8 }, max: 50, min: 5 },
        shape: 'circle'
    },
    physics: {
        barnesHut: { springLength: 250 },
        enabled: true,
        forceAtlas2Based: { springLength: 250 },
        repulsion: { springLength: 250 },
        solver: 'repulsion',
        wind: { x: 0.5, y: 0 }
    }
}

const markovConfigs = [
    { id: 'values', label: 'Values', populate: async (container) =>
        renderVisNetwork(container || markovView.value, nodes, edges, options)
    }
];

const chordDiagramConfigs = [
    { id: 'values', label: 'Values', populate: async (container) =>
        renderHighcharts(container || chordDiagramView.value, {
            chart: { type: 'dependencywheel' },
            title: { text: 'Highcharts Dependency Wheel' },
            accessibility: { point: { valueDescriptionFormat: '{index}. From {point.from} to {point.to}: {point.weight}.' } },
            series: [
                {
                    keys: ['from', 'to', 'weight'],
                    data: [
                        ['Brazil', 'Portugal', 5],
                        ['Brazil', 'France', 1],
                        ['Brazil', 'Spain', 1],
                        ['Brazil', 'England', 1],
                        ['Canada', 'Portugal', 1],
                        ['Canada', 'France', 5],
                        ['Canada', 'England', 1],
                        ['Mexico', 'Portugal', 1],
                        ['Mexico', 'France', 1],
                        ['Mexico', 'Spain', 5],
                        ['Mexico', 'England', 1],
                        ['USA', 'Portugal', 1],
                        ['USA', 'France', 1],
                        ['USA', 'Spain', 1],
                        ['USA', 'England', 5],
                        ['Portugal', 'Angola', 2],
                        ['Portugal', 'Senegal', 1],
                        ['Portugal', 'Morocco', 1],
                        ['Portugal', 'South Africa', 3],
                        ['France', 'Angola', 1],
                        ['France', 'Senegal', 3],
                        ['France', 'Mali', 3],
                        ['France', 'Morocco', 3],
                        ['France', 'South Africa', 1],
                        ['Spain', 'Senegal', 1],
                        ['Spain', 'Morocco', 3],
                        ['Spain', 'South Africa', 1],
                        ['England', 'Angola', 1],
                        ['England', 'Senegal', 1],
                        ['England', 'Morocco', 2],
                        ['England', 'South Africa', 7],
                        ['South Africa', 'China', 5],
                        ['South Africa', 'India', 1],
                        ['South Africa', 'Japan', 3],
                        ['Angola', 'China', 5],
                        ['Angola', 'India', 1],
                        ['Angola', 'Japan', 3],
                        ['Senegal', 'China', 5],
                        ['Senegal', 'India', 1],
                        ['Senegal', 'Japan', 3],
                        ['Mali', 'China', 5],
                        ['Mali', 'India', 1],
                        ['Mali', 'Japan', 3],
                        ['Morocco', 'China', 5],
                        ['Morocco', 'India', 1],
                        ['Morocco', 'Japan', 3],
                        ['Japan', 'Brazil', 1]
                    ],
                    name: 'Dependency wheel series',
                    dataLabels: { color: '#333', style: { textOutline: 'none' }, textPath: { enabled: true }, distance: 10 },
                    size: '95%'
                }
            ]
        })
    }
];

const sankeyDiagramConfigs = [
    { id: 'values', label: 'Values', populate: async (container) =>
        renderHighcharts(container || sankeyDiagramView.value, {
            chart: { type: 'sankey' },
            title: {
                text: 'Estimated US Energy Consumption in 2017'
            },
            subtitle: {
                text: "Source: <a href='https://www.llnl.gov/'> Lawrence Livermore National Laboratory</a>"
            },
            accessibility: {
                point: {
                    valueDescriptionFormat: '{index}. {point.from} to {point.to}, {point.weight}.'
                }
            },
            tooltip: {
                headerFormat: null,
                pointFormat: '{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight:.2f} quads',
                nodeFormat: '{point.name}: {point.sum:.2f} quads'
            },
            series: [
                {
                    keys: ['from', 'to', 'weight'],
                    nodes: [
                        { id: 'Electricity & Heat', color: '#ffa500', offset: -110 },
                        { id: 'Residential', color: '#74ffe7', column: 2, offset: 50 },
                        { id: 'Commercial', color: '#8cff74', column: 2, offset: 50 },
                        { id: 'Industrial', color: '#ff8da1', column: 2, offset: 50 },
                        { id: 'Transportation', color: '#f4c0ff', column: 2, offset: 50 },
                        { id: 'Rejected Energy', color: '#e6e6e6', column: 3, offset: -30 },
                        { id: 'Energy Services', color: '#F9E79F', column: 3 },
                        { id: 'Solar', color: '#009c00' },
                        { id: 'Nuclear', color: '#1a8dff' },
                        { id: 'Hydro', color: '#009c00' },
                        { id: 'Wind', color: '#009c00' },
                        { id: 'Geothermal', color: '#009c00' },
                        { id: 'Natural Gas', color: '#1a8dff' },
                        { id: 'Biomass', color: '#009c00' },
                        { id: 'Coal', color: '#989898' },
                        { id: 'Petroleum', color: '#989898', offset: -1 }
                    ],
                    data: [
                        ['Solar', 'Electricity & Heat', 0.48],
                        ['Nuclear', 'Electricity & Heat', 8.42],
                        ['Hydro', 'Electricity & Heat', 2.75],
                        ['Wind', 'Electricity & Heat', 2.35],
                        ['Geothermal', 'Electricity & Heat', 0.15],
                        ['Natural Gas', 'Electricity & Heat', 9.54],
                        ['Coal', 'Electricity & Heat', 12.7],
                        ['Biomass', 'Electricity & Heat', 0.52],
                        ['Petroleum', 'Electricity & Heat', 0.21],

                        ['Electricity & Heat', 'Residential', 4.7],
                        ['Solar', 'Residential', 0.19],
                        ['Geothermal', 'Residential', 0.04],
                        ['Natural Gas', 'Residential', 4.58],
                        ['Biomass', 'Residential', 0.33],
                        ['Petroleum', 'Residential', 0.88],

                        ['Electricity & Heat', 'Commercial', 4.6],
                        ['Solar', 'Commercial', 0.08],
                        ['Geothermal', 'Commercial', 0.02],
                        ['Natural Gas', 'Commercial', 3.29],
                        ['Coal', 'Commercial', 0.02],
                        ['Biomass', 'Commercial', 0.16],
                        ['Petroleum', 'Commercial', 0.83],

                        ['Electricity & Heat', 'Industrial', 3.23],
                        ['Solar', 'Industrial', 0.02],
                        ['Hydro', 'Industrial', 0.01],
                        ['Natural Gas', 'Industrial', 9.84],
                        ['Coal', 'Industrial', 1.24],
                        ['Biomass', 'Industrial', 2.48],
                        ['Petroleum', 'Industrial', 8.38],

                        ['Electricity & Heat', 'Transportation', 0.03],
                        ['Natural Gas', 'Transportation', 0.76],
                        ['Biomass', 'Transportation', 1.43],
                        ['Petroleum', 'Transportation', 25.9],

                        ['Electricity & Heat', 'Rejected Energy', 24.7],
                        ['Residential', 'Rejected Energy', 3.75],
                        ['Commercial', 'Rejected Energy', 3.15],
                        ['Industrial', 'Rejected Energy', 12.9],
                        ['Transportation', 'Rejected Energy', 22.2],

                        ['Residential', 'Energy Services', 6.97],
                        ['Commercial', 'Energy Services', 5.84],
                        ['Industrial', 'Energy Services', 12.4],
                        ['Transportation', 'Energy Services', 5.91]
                    ],
                    name: 'Sankey demo series'
                }
            ]
        })
    }
];
</script>

# {{ frontmatter.title }}

<SubHeader text="Human Resources - Workforce" />

...

## Single Step Summary Flow (Chord Diagram)

...

<VisualContainer class="datapos-wide" :configs="chordDiagramConfigs">
    <template #default="{ activeTabId }">
        <div ref="chordDiagramView" style="height: 100%"/>
    </template>
</VisualContainer>

## Multi Step Summary Flow (Sankey Diagram)

...

<VisualContainer class="datapos-wide" :configs="sankeyDiagramConfigs">
    <template #default="{ activeTabId }">
        <div ref="sankeyDiagramView" style="height: 100%"/>
    </template>
</VisualContainer>

## Detailed Flow (Markov Diagram)

...

<VisualContainer class="datapos-wide" :configs="markovConfigs">
    <template #default="{ activeTabId }">
        <div ref="markovView" style="height: 100%"/>
    </template>
</VisualContainer>

<style>
    :deep(.css-168glwu-group-label) {
        stroke: black;
    }
</style>
