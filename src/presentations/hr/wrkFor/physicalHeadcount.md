---
label:
    en-gb: Physical Headcount
description:
    en-gb: This is a description...
order: 1
---

# {{label}}

<b>Human Resources - Workforce</b>

{{description}}

Measures the number of people employed by one or more organizations at specific points in time. These points in time are defined in terms of reporting periods, such as weeks, months, quarters, or years. The most frequently used points are period opening, starting, ending, and closing.

Physical headcount measures the actual number of people being counted at a fixed point in time. Please see ... and ... for measures that report headcount capacity across time. There are two versions ... opening / closing and starting / ending ...

## Opening/Closing Headcount

Quantifies the variation in physical headcount between the opening and closing of specific reporting periods.

```json datapos-visual
{
    "content": {
        "title": { "text": "Opening/Closing Headcount" },
        "data": {
            "name": "Headcount",
            "categoryLabels": { "values": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
            "measures": [
                { "id": "openingHeadcount", "name": "Opening" },
                { "id": "closingHeadcount", "name": "Closing" }
            ]
        }
    },
    "views": [
        { "categoryId": "cartesian", "typeId": "areaLine" },
        { "categoryId": "cartesian", "typeId": "bar" },
        { "categoryId": "cartesian", "typeId": "column" },
        { "categoryId": "cartesian", "typeId": "line", "default": true },
        { "categoryId": "polar", "typeId": "area" },
        { "categoryId": "polar", "typeId": "column" },
        { "categoryId": "polar", "typeId": "line" },
        { "categoryId": "range", "typeId": "area" },
        { "categoryId": "range", "typeId": "bar" },
        { "categoryId": "range", "typeId": "column" },
        { "categoryId": "values" }
    ]
}
```

Describe opening/closing headcounts...

## Starting/Ending Headcount

Quantifies the variation in physical headcount between the starting and ending of specific reporting periods.

```json datapos-visual
{
    "content": {
        "title": { "text": "Starting/Ending Headcount" },
        "data": {
            "name": "Headcount",
            "categoryLabels": { "values": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
            "measures": [
                { "id": "startingHeadcount", "name": "Starting" },
                { "id": "endingHeadcount", "name": "Ending" }
            ]
        }
    },
    "views": [
        { "categoryId": "cartesian", "typeId": "column" },
        { "categoryId": "cartesian", "typeId": "line", "default": true },
        { "categoryId": "polar", "typeId": "column" },
        { "categoryId": "polar", "typeId": "line" },
        { "categoryId": "range", "typeId": "area" },
        { "categoryId": "range", "typeId": "column" },
        { "categoryId": "values" }
    ]
}
```

Describe starting ending headcounts...

## Headcount Range Comparisons

...

```json datapos-visual
{
    "content": {
        "title": { "text": "Monthly Headcount Flow & Boundaries" },
        "data": {
            "name": "Headcount",
            "categoryLabels": { "values": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
            "measures": [
                { "id": "openingHeadcount", "name": "Opening" },
                { "id": "closingHeadcount", "name": "Closing" },
                { "id": "startingHeadcount", "name": "Starting" },
                { "id": "endingHeadcount", "name": "Ending" }
            ]
        }
    },
    "views": [{ "categoryId": "periodFlowBoundaries" }]
}
```

Describe opening/closing starting/ending comparison...

```json datapos-highcharts
{
    "chart": { "type": "waterfall" },
    "title": { "text": "Period Flow & Boundary Chart" },
    "tooltip": { "shared": true },
    "xAxis": {
        "categories": ["B/F", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "C/F"]
    },
    "yAxis": {},
    "plotOptions": {
        "columnrange": { "grouping": false },
        "series": { "enableMouseTracking": false },
        "waterfall": { "borderRadius": 0 }
    },
    "series": [
        {
            "name": "Boundary",
            "zIndex": 1,
            "borderColor": "#a1a1aa",
            "type": "columnrange",
            "color": "#dcfce7",
            "data": [null, [16, 44], [36, 64], null, { "low": 56, "high": 84, "color": "#ffedd5" }, { "low": 36, "high": 64, "color": "#ffedd5" }],
            "showInLegend": false
        },
        {
            "name": "Increasing",
            "type": "columnrange",
            "color": "#86efac",
            "showInLegend": true,
            "data": [],
            "enableMouseTracking": false
        },
        {
            "name": "Decreasing",
            "zIndex": 2,
            "borderColor": "#d4d4d8",
            "upColor": "#86efac",
            "color": "#fed7aa",
            "data": [{ "y": 20, "color": "#e4e4e7" }, 20, 20, { "y": 20 }, -20, -20, 0, 0, 0, 0, 0, 0, 0, { "isSum": true, "color": "#e4e4e7" }]
        },
        {
            "name": "Border",
            "zIndex": 2,
            "borderColor": "#d4d4d8",
            "type": "columnrange",
            "color": "transparent",
            "data": [[0, 20], [16, 44], [36, 64], [60, 80], [56, 84], [36, 64], null, null, null, null, null, null, null, [0, 40]],
            "showInLegend": false
        }
    ]
}
```

```json datapos-highcharts
{
    "colors": ["rgba(124, 181, 236, 0.3)", "rgba(144, 237, 125, 0.3)"],
    "chart": { "type": "waterfall" },
    "title": { "text": "Highcharts stacked waterfall (overlap)" },
    "tooltip": { "shared": true },
    "xAxis": { "categories": ["0", "1", "2", "1. Intermediate Sum", "4", "2. Intermediate Sum", "6", "Sum"] },
    "yAxis": { "tickInterval": 10 },
    "plotOptions": { "series": { "stacking": "overlap", "lineWidth": 1 } },
    "series": [
        {
            "zIndex": 1,
            "upColor": {
                "pattern": { "color": "#15af15", "width": 20, "height": 20, "opacity": 0.6, "path": { "d": "M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18", "strokeWidth": 4 } }
            },
            "color": {
                "pattern": { "color": "#0088ff", "width": 20, "height": 20, "opacity": 0.6, "path": { "d": "M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18", "strokeWidth": 4 } }
            },
            "data": [
                20,
                -10,
                40,
                {
                    "isIntermediateSum": true,
                    "color": {
                        "pattern": {
                            "color": "#0A500A",
                            "width": 20,
                            "height": 20,
                            "opacity": 0.6,
                            "path": { "d": "M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18", "strokeWidth": 4 }
                        }
                    }
                },
                -10,
                {
                    "isIntermediateSum": true,
                    "color": {
                        "pattern": {
                            "color": "#003E74",
                            "width": 20,
                            "height": 20,
                            "opacity": 0.6,
                            "path": { "d": "M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18", "strokeWidth": 4 }
                        }
                    }
                },
                -20,
                {
                    "isSum": true,
                    "color": {
                        "pattern": {
                            "color": "#0A500A",
                            "width": 20,
                            "height": 20,
                            "opacity": 0.6,
                            "path": { "d": "M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18", "strokeWidth": 4 }
                        }
                    }
                }
            ]
        },
        {
            "zIndex": 0,
            "upColor": "rgba(21, 175, 21, 0.3)",
            "color": "rgba(0, 136, 255, 0.3)",
            "data": [
                20,
                40,
                -10,
                { "isIntermediateSum": true, "color": "rgba(10, 80, 10, 0.3)" },
                30,
                { "isIntermediateSum": true, "color": "rgba(10, 80, 10, 0.3)" },
                -20,
                { "isSum": true, "color": "rgba(10, 80, 10, 0.3)" }
            ]
        }
    ]
}
```

## Explanatory Notes

! [](./hc.svg)

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

```javascript
const items = [];
let count = 0;
for (const item of items) {
    count++;
}
console.log('A very long line of text that will test how the code block wraps on narrow screens, hope this works.');
console.log(count);
```

$$
L = \frac{1}{2} \rho v^2 S C_L
$$

$$
Termination Rate = \frac{Average Headcount}{Terminations}
$$

> A blockquote...

- Unordered list 1
- Unordered list 2
- Unordered list 3
- Unordered list 4
- Unordered list 5

1. Ordered list 1
1. Unordered list 2
1. Unordered list 3
1. Unordered list 4
1. Unordered list 5

| Col 1       | Col 2       |
| ----------- | ----------- |
| Row 1 Val 1 | Row 1 Val 2 |
| Row 2 Val 1 | Row 2 Val 2 |
| Row 3 Val 1 | Row 3 Val 2 |
| Row 4 Val 1 | Row 4 Val 2 |
| Row 5 Val 1 | Row 5 Val 2 |
