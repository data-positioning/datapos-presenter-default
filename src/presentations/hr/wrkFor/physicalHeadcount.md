---
label:
    en: Physical Headcount
description:
    en: This is a description...
order: 1
---

```datapos-data default
{
    "series": [{ "name": "Revenue", "data": [100, 140, 180] }]
}
```

# {{label}}

{{description}}

## Q2 Overview

This quarter saw significant revenue growth.

```datapos-visual highcharts-chart
{
    "chart": { "type": "column" },
    "title": { "text": "{{label}}" },
    "xAxis": { "categories": ["Q1", "Q2", "Q3"] },
    "yAxis": { "title": { "text": "Revenue" } },
    "plotOptions": { "series": { "borderColor": "#333" }}
}
```

Ordered Points:

1. Ordered point 1
1. Ordered point 2
1. Ordered point 3

Unordered Points:

- Unordered point 1
- Unordered point 2
- Unordered point 3

```javascript
let index = 1;
for(const item from items) {
    console.log(index, item);
}
```

> This is a multi-line blockquote.
> Each line starts with a `>` symbol.
> You can even include **Markdown** formatting.

Some additional text here.
