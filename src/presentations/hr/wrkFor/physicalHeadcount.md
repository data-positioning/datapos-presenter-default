---
label:
    en: Physical Headcount
description:
    en: This is a description...
order: 1
---

# {{label}}

Human Resources - Workforce

{{description}}

Measures the number of people employed by one or more organizations at specific points in time. These points in time are defined in terms of reporting periods, such as weeks, months, quarters, or years. The most frequently used points are period opening, starting, ending, and closing.

Physical headcount measures the actual number of people being counted at a fixed point in time. Please see ... and ... for measures that report headcount capacity across time. There are two versions ... opening / closing and starting / ending ...

## Opening/Closing Headcount

Quantifies the variation in physical headcount between the opening and closing of specific reporting periods.

```datapos-visual highcharts-chart
{
    "chart": { "type": "line" },
    "plotOptions": { "series": { "borderColor": "#333" }},
    "series": [
        { "measureId": "openingHeadcount", "name": "Opening", "data": [1105, 1110, 1109, 1129, 1129, 1134, 1172, 1173, 1176, 1186, 1189, 1213]},
        { "measureId": "closingHeadcount", "name": "Closing", "data": [1110, 1109, 1129, 1129, 1134, 1172, 1173, 1176, 1186, 1189, 1213, 1211]}
    ],
    "title": { "text": "Opening/Closing Headcount" },
    "xAxis": { "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
    "yAxis": { "title": { "text": "Headcount" } }
}
```

Describe opening/closing headcounts...

## Starting/Ending Headcount

Quantifies the variation in physical headcount between the starting and ending of specific reporting periods.

<VisualContainer class="datapos-wide" :configs="startEndConfigs">
    <template #default="{ activeTabId }">
        <div v-if="activeTabId === 'values'" ref="startEndView" style="height: 100%"/>
        <div v-if="activeTabId === 'range'" ref="startEndView" class="datapos-no-toggle-columnrange-visibility" style="height: 100%"/>
    </template>
</VisualContainer>

Describe starting ending headcounts...

## Headcount Range Comparisons

...

<VisualContainer class="datapos-full" :configs="comparisonConfigs">
    <template #default="{ activeTabId }">
        <div ref="comparisonView" class="datapos-no-toggle-columnrange-visibility" style="height: 100%"/>
    </template>
</VisualContainer>

Describe opening/closing starting/ending comparison...

## Explanatory Notes

![](./hc.svg)

Changes in headcount during a period obviously imply that people are joining and leaving the workforce.

We can visualise the headcount ranges for each period, and the progression from one period to the next, using a floating column chart.

Green columns represent a net increase in headcount for a period. Orange columns represent a net decrease in headcount. The wider light green/orange columns show opening/closing ranges while the narrower dark green/orange columns show starting/ending ranges.

The bottom of each green column represents the opening or starting headcount for a period of increase. The top the ending or closing headcount. The top of each orange column represents the opening or starting headcount for a period of decline. The bottom the ending or closing headcount.

The problem with this charts is that to provides no understanding of the volume of hires and terminations within each period.

These measures quantify the number of people (physical/actual) available for work at a specific point in time. A good example is Ending Headcount – the number of people employed/contracted at the end of a given period.

Whereas it is possible to calculate headcount for any period, practical options include hours, days, months, quarters and years.

Experience shows that we use two sets of point in time headcount measures:

Open/Closing headcounts and,
Starting/Ending headcounts.
Opening Headcount quantifies the number of people brought forward from the previous period. Closing Headcount quantifies the number of people carried forward into the next period.

Starting Headcount quantifies the number of people available for work from the start of a period. This measure includes people who were available for work from the beginning of a period but were not brought forward from the previous period (i.e. joined the workforce in the respective period). Ending Headcount represents the number of people available for work until the end of a period. This measure includes people who worked until the end of the period but were not carried forward into the next period (i.e. left the workforce in the respective period).

An accountant may think in terms of brought/carry forward counts (i.e. reconciling headcounts from one period to the next). A manager may think in terms of start/end counts (i.e. the number of people available for work).

The following simple line chart presents the monthly point in time headcounts for a given year. It is useful for displaying one maybe two measures but becomes confusing if we show more. You can click on the legend items to show/hide individual measures.

The challenge with this chart is that whereas we can quickly determine the change in individual measures across time, it is difficult to understand the relationships between them.

---

This chart displays 'point in time' headcounts by month for a given calendar year using a line chart from the Chart.js library.

It includes all four 'point in time' measures (Opening Headcount, Starting Headcount, Ending Headcount and Closing Headcount). Initially, only Ending Headcount is visible. You can click the legend items to toggle the visibility of individual measures.

It excels at visualising a single headcount measure over time. It can also be used to compare multiple headcounts but quickly becomes confusing if three or more are visible at once.

A non-zero baseline is preferred in this case to emphasise the change in headcount values over time.

Area, bar and radar versions are also possible.

---

The actual (physical) number of people in the workforce at a specific point in time. Values are calculated in terms of reporting periods (days, shifts, rotations, pay periods, weeks, fortnights, 4 week durations, months, quarters, years...). Opening/closing values represent the headcount as a period opens (bring forward) and closes (carry forward). Starting/ending values represent the headcount at the point the period starts and ends.

```

```
