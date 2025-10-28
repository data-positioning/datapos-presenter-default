---
label:
    en: Physical Headcount
description:
    en: This is a description...
order: 1
---

```data
setSeries([{ "name": "Revenue", "data": [100, 140, 180] }])
```

# {{label}}

{{description}}

## Q2 Overview

This quarter saw significant revenue growth.

```visual
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
