---
title: Movements (Entry, Internal & Exit)
---

<script setup>
import { onMounted, ref } from 'vue';
import { useMainStore } from '@/stores/mainStore';
import SubHeader from '@/components_V1/SubHeader.vue';
import VisualContainer from '@/components_V1/VisualContainer.vue'
const mainStore = useMainStore();
mainStore.workbenchTitle = frontmatter.title;
onMounted(() => void (mainStore.hideWorkbenchMask()));
</script>

# {{ frontmatter.title }}

<SubHeader text="Human Resources - Workforce" />

## Movements - Table (Values & Sparklines)

...

## Movements - Bar Chart

...

## Movements - Stream Chart

...

## Internal Movements

...

## Movements - Waterfall Chart

...

## Net Movements

...

## Other

...

![](./diagram.png)

[PeopleFluent](https://www.peoplefluent.com/blog/insights/8-data-visualizations-with-peoplefluent-performance-compensation-succession/)
