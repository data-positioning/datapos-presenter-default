---
label:
    en: Physical Headcount
description:
    en: This is a description...
order: 1
---

```data {1,3} title="example.js" hl_lines="2 4"
setSeries([{ "name": "Revenue", "data": [100, 140, 180] }])
```

# {{label}}

{{description}}

## Q2 Overview

This quarter saw significant revenue growth.

```visual type="highchartsChart"
{
    typeId: 'highchartsChart',
    options: {
        "chart": { "type": "column" },
        "title": { "text": "{{label}}" },
        "xAxis": { "categories": ["Q1", "Q2", "Q3"] },
        "yAxis": { "title": { "text": "Revenue" } },
        "series": series
    }
}
```

Some additional text here.
