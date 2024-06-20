---
title: Workforce
---

<script setup>
import { onMounted } from 'vue';
import { useMainStore } from '@/stores/mainStore';
const mainStore = useMainStore();
mainStore.workbenchTitle = frontmatter.title;
onMounted(() => void (mainStore.hideWorkbenchMask()));
</script>

# {{ frontmatter.title }}

These presentations are divided into the following sections:

-   <router-link to="/workflow/exploreResults/humanResources/workforce/physicalHeadcount">Physical Headcount</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/workforce/averageHeadcount">Average Headcount</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/workforce/hiresTerminations">Hires & Terminations</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/workforce/fteHeadcount">Full-Time Equivalent Headcount</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/workforce/movements">Movements (Entry, Internal & Exit)</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/workforce/movementFlows">Movement Flows</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/workforce/employeeProfiles">Employee Profiles</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/workforce/headcountSummary">Headcount Summary</router-link>

## Notes

The following sections provide data for workforce size, hires and terminations.

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

## Size

-   Physical Headcount
-   Headcount Range
-   Hires & Terminations
-   Headcount Progression
-   Average Headcount
-   Full-Time Equivalents
-   Headcount Summary

## Hires

...

## Terminations

...

## Headcount Summary

The following table provides a complete list of all measures by month.
