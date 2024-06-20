---
title: Human Resources
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

-   <router-link to="/workflow/exploreResults/humanResources/workforce">Workforce</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/recruitmentOnboarding">Recruitment & Onboarding</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/learning">Learning</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/talentManagement">Talent Management</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/attendance">Attendance</router-link>
-   <router-link to="/workflow/exploreResults/humanResources/compensation">Compensation</router-link>
