function w() {
  function c(e, a) {
    console.log(1111, e), console.log(2222, a), console.log(3333, a.childNodes), console.log(4444, a.children);
  }
  return { render: c };
}
const y = "datapos-presenter-default", H = { "en-gb": "Default Presenter" }, T = { "en-gb": "..." }, v = "alpha", I = "presenter", F = "0.1.1003", C = [{ id: "hrWrkForAverageHeadcount", label: { "en-gb": "Average Headcount" }, description: { "en-gb": "This is a description..." }, order: 2, path: "hr/wrkFor/averageHeadcount" }, { id: "hrWrkForFtes", label: { "en-gb": "Full-Time Equivalents" }, description: { "en-gb": "This is a description..." }, order: 4, path: "hr/wrkFor/ftes" }, { id: "hrWrkForHeadcountSummary", label: { "en-gb": "Headcount Summary" }, description: { "en-gb": "This is a description..." }, order: 7, path: "hr/wrkFor/headcountSummary" }, { id: "hrWrkForHiresTerminations", label: { "en-gb": "Hires & Terminations" }, description: { "en-gb": "This is a description..." }, order: 3, path: "hr/wrkFor/hiresTerminations" }, { id: "hrWrkForMovementFlows", label: { "en-gb": "Movement Flows" }, description: { "en-gb": "This is a description..." }, order: 6, path: "hr/wrkFor/movementFlows" }, { id: "hrWrkForMovements", label: { "en-gb": "Movements (Entry, Internal & Exit)" }, description: { "en-gb": "This is a description..." }, order: 5, path: "hr/wrkFor/movements" }, { id: "hrWrkForPhysicalHeadcount", label: { "en-gb": "Physical Headcount" }, description: { "en-gb": "This is a description..." }, order: 1, path: "hr/wrkFor/physicalHeadcount" }], k = {
  id: y,
  label: H,
  description: T,
  statusId: v,
  typeId: I,
  version: F,
  presentations: C
}, E = {
  "hr/wrkFor/averageHeadcount": { id: "hrWrkForAverageHeadcount", label: { "en-gb": "Average Headcount" }, description: { "en-gb": "This is a description..." }, order: 2, statusId: "alpha", typeId: "presenterPresentation", content: `Human Resources - Workforce

...
` },
  "hr/wrkFor/ftes": { id: "hrWrkForFtes", label: { "en-gb": "Full-Time Equivalents" }, description: { "en-gb": "This is a description..." }, order: 4, statusId: "alpha", typeId: "presenterPresentation", content: `Human Resources - Workforce

...
` },
  "hr/wrkFor/headcountSummary": { id: "hrWrkForHeadcountSummary", label: { "en-gb": "Headcount Summary" }, description: { "en-gb": "This is a description..." }, order: 7, statusId: "alpha", typeId: "presenterPresentation", content: "" },
  "hr/wrkFor/hiresTerminations": { id: "hrWrkForHiresTerminations", label: { "en-gb": "Hires & Terminations" }, description: { "en-gb": "This is a description..." }, order: 3, statusId: "alpha", typeId: "presenterPresentation", content: `Human Resources - Workforce

People joining and leaving the workforce...

## Hires

New Hires & Rehires vs External & Internal Hires...

## Hire Rate

...

## Terminations

...

## Termination Rate

...

## Headcount Progression

...

## Net Growth Ratio

...

## Retention Rate

...
` },
  "hr/wrkFor/movementFlows": { id: "hrWrkForMovementFlows", label: { "en-gb": "Movement Flows" }, description: { "en-gb": "This is a description..." }, order: 6, statusId: "alpha", typeId: "presenterPresentation", content: `Human Resources - Workforce

...

## Single Step Summary Flow (Chord Diagram)

...

## Multi Step Summary Flow (Sankey Diagram)

...

## Detailed Flow (Markov Diagram)
` },
  "hr/wrkFor/movements": { id: "hrWrkForMovements", label: { "en-gb": "Movements (Entry, Internal & Exit)" }, description: { "en-gb": "This is a description..." }, order: 5, statusId: "alpha", typeId: "presenterPresentation", content: `Human Resources - Workforce

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

![](./movementDiagram.png)

[PeopleFluent](https://www.peoplefluent.com/blog/insights/8-data-visualizations-with-peoplefluent-performance-compensation-succession/)
` },
  "hr/wrkFor/physicalHeadcount": /* @__PURE__ */ JSON.parse('{"id":"hrWrkForPhysicalHeadcount","label":{"en-gb":"Physical Headcount"},"description":{"en-gb":"This is a description..."},"order":1,"statusId":"alpha","typeId":"presenterPresentation","content":"Measures the number of people employed by one or more organizations at specific points in time. These points in time are defined in terms of reporting periods, such as weeks, months, quarters, or years. The most frequently used points are period opening, starting, ending, and closing.\\n\\nPhysical headcount measures the actual number of people being counted at a fixed point in time. Please see ... and ... for measures that report headcount capacity across time. There are two versions ... opening / closing and starting / ending ...\\n\\n## Opening/Closing Headcount\\n\\nQuantifies the variation in physical headcount between the opening and closing of specific reporting periods.\\n\\n```json datapos-visual\\n{\\"content\\":{\\"title\\":{\\"text\\":\\"Opening/Closing Headcount\\"},\\"data\\":{\\"label\\":{\\"text\\":\\"Headcount\\"},\\"dimension\\":{\\"label\\":{\\"text\\":\\"Months\\"},\\"values\\":[{\\"label\\":{\\"text\\":\\"Jan\\"}},{\\"label\\":{\\"text\\":\\"Feb\\"}},{\\"label\\":{\\"text\\":\\"Mar\\"}},{\\"label\\":{\\"text\\":\\"Apr\\"}},{\\"label\\":{\\"text\\":\\"May\\"}},{\\"label\\":{\\"text\\":\\"Jun\\"}},{\\"label\\":{\\"text\\":\\"Jul\\"}},{\\"label\\":{\\"text\\":\\"Aug\\"}},{\\"label\\":{\\"text\\":\\"Sep\\"}},{\\"label\\":{\\"text\\":\\"Oct\\"}},{\\"label\\":{\\"text\\":\\"Nov\\"}},{\\"label\\":{\\"text\\":\\"Dec\\"}}]},\\"measures\\":[{\\"id\\":\\"openingHeadcount\\",\\"name\\":\\"Opening\\"},{\\"id\\":\\"closingHeadcount\\",\\"name\\":\\"Closing\\"}]}},\\"views\\":[{\\"categoryId\\":\\"cartesianChart\\",\\"typeId\\":\\"areaLine\\"},{\\"categoryId\\":\\"cartesianChart\\",\\"typeId\\":\\"areaSpline\\"},{\\"categoryId\\":\\"cartesianChart\\",\\"typeId\\":\\"bar\\"},{\\"categoryId\\":\\"cartesianChart\\",\\"typeId\\":\\"column\\"},{\\"categoryId\\":\\"cartesianChart\\",\\"typeId\\":\\"line\\",\\"default\\":true},{\\"categoryId\\":\\"cartesianChart\\",\\"typeId\\":\\"spline\\"},{\\"categoryId\\":\\"polarChart\\",\\"typeId\\":\\"areaLine\\"},{\\"categoryId\\":\\"polarChart\\",\\"typeId\\":\\"areaRange\\"},{\\"categoryId\\":\\"polarChart\\",\\"typeId\\":\\"areaSpline\\"},{\\"categoryId\\":\\"polarChart\\",\\"typeId\\":\\"column\\"},{\\"categoryId\\":\\"polarChart\\",\\"typeId\\":\\"columnRange\\"},{\\"categoryId\\":\\"polarChart\\",\\"typeId\\":\\"line\\"},{\\"categoryId\\":\\"polarChart\\",\\"typeId\\":\\"spline\\"},{\\"categoryId\\":\\"rangeChart\\",\\"typeId\\":\\"areaLine\\"},{\\"categoryId\\":\\"rangeChart\\",\\"typeId\\":\\"areaSpline\\"},{\\"categoryId\\":\\"rangeChart\\",\\"typeId\\":\\"bar\\"},{\\"categoryId\\":\\"rangeChart\\",\\"typeId\\":\\"column\\"},{\\"categoryId\\":\\"valueTable\\"}]}\\n```\\n\\nDescribe opening/closing headcounts...\\n\\n## Starting/Ending Headcount\\n\\nQuantifies the variation in physical headcount between the starting and ending of specific reporting periods.\\n\\n```json datapos-visual\\n{\\"content\\":{\\"title\\":{\\"text\\":\\"Starting/Ending Headcount\\"},\\"data\\":{\\"label\\":{\\"text\\":\\"Headcount\\"},\\"dimension\\":{\\"label\\":{\\"text\\":\\"Months\\"},\\"values\\":[{\\"label\\":{\\"text\\":\\"Jan\\"}},{\\"label\\":{\\"text\\":\\"Feb\\"}},{\\"label\\":{\\"text\\":\\"Mar\\"}},{\\"label\\":{\\"text\\":\\"Apr\\"}},{\\"label\\":{\\"text\\":\\"May\\"}},{\\"label\\":{\\"text\\":\\"Jun\\"}},{\\"label\\":{\\"text\\":\\"Jul\\"}},{\\"label\\":{\\"text\\":\\"Aug\\"}},{\\"label\\":{\\"text\\":\\"Sep\\"}},{\\"label\\":{\\"text\\":\\"Oct\\"}},{\\"label\\":{\\"text\\":\\"Nov\\"}},{\\"label\\":{\\"text\\":\\"Dec\\"}}]},\\"measures\\":[{\\"id\\":\\"startingHeadcount\\",\\"name\\":\\"Starting\\"},{\\"id\\":\\"endingHeadcount\\",\\"name\\":\\"Ending\\"}]}},\\"views\\":[{\\"categoryId\\":\\"cartesianChart\\",\\"typeId\\":\\"column\\"},{\\"categoryId\\":\\"cartesianChart\\",\\"typeId\\":\\"line\\",\\"default\\":true},{\\"categoryId\\":\\"polarChart\\",\\"typeId\\":\\"column\\"},{\\"categoryId\\":\\"polarChart\\",\\"typeId\\":\\"line\\"},{\\"categoryId\\":\\"rangeChart\\",\\"typeId\\":\\"areaLine\\"},{\\"categoryId\\":\\"rangeChart\\",\\"typeId\\":\\"column\\"},{\\"categoryId\\":\\"valueTable\\"}]}\\n```\\n\\nDescribe starting ending headcounts...\\n\\n## Headcount Range Comparisons\\n\\n...\\n\\n```json datapos-visual\\n{\\"content\\":{\\"title\\":{\\"text\\":\\"Monthly Headcount Flow & Boundaries\\"},\\"data\\":{\\"label\\":{\\"text\\":\\"Headcount\\"},\\"dimension\\":{\\"label\\":{\\"text\\":\\"Months\\"},\\"values\\":[{\\"label\\":{\\"text\\":\\"Jan\\"}},{\\"label\\":{\\"text\\":\\"Feb\\"}},{\\"label\\":{\\"text\\":\\"Mar\\"}},{\\"label\\":{\\"text\\":\\"Apr\\"}},{\\"label\\":{\\"text\\":\\"May\\"}},{\\"label\\":{\\"text\\":\\"Jun\\"}},{\\"label\\":{\\"text\\":\\"Jul\\"}},{\\"label\\":{\\"text\\":\\"Aug\\"}},{\\"label\\":{\\"text\\":\\"Sep\\"}},{\\"label\\":{\\"text\\":\\"Oct\\"}},{\\"label\\":{\\"text\\":\\"Nov\\"}},{\\"label\\":{\\"text\\":\\"Dec\\"}}]},\\"measures\\":[{\\"id\\":\\"openingHeadcount\\",\\"name\\":\\"Opening\\"},{\\"id\\":\\"closingHeadcount\\",\\"name\\":\\"Closing\\"},{\\"id\\":\\"startingHeadcount\\",\\"name\\":\\"Starting\\"},{\\"id\\":\\"endingHeadcount\\",\\"name\\":\\"Ending\\"}]}},\\"views\\":[{\\"categoryId\\":\\"periodFlowBoundariesChart\\"}]}\\n```\\n\\nDescribe opening/closing starting/ending comparison...\\n\\n```json datapos-highcharts\\n{\\"chart\\":{\\"type\\":\\"waterfall\\"},\\"title\\":{\\"text\\":\\"Period Flow & Boundary Chart\\"},\\"tooltip\\":{\\"shared\\":true},\\"xAxis\\":{\\"categories\\":[\\"B/F\\",\\"Jan\\",\\"Feb\\",\\"Mar\\",\\"Apr\\",\\"May\\",\\"Jun\\",\\"Jul\\",\\"Aug\\",\\"Sep\\",\\"Oct\\",\\"Nov\\",\\"Dec\\",\\"C/F\\"]},\\"yAxis\\":{},\\"plotOptions\\":{\\"columnrange\\":{\\"grouping\\":false},\\"series\\":{\\"enableMouseTracking\\":false},\\"waterfall\\":{\\"borderRadius\\":0}},\\"series\\":[{\\"name\\":\\"Boundary\\",\\"zIndex\\":1,\\"borderColor\\":\\"#a1a1aa\\",\\"type\\":\\"columnrange\\",\\"color\\":\\"#dcfce7\\",\\"data\\":[null,[16,44],[36,64],null,{\\"low\\":56,\\"high\\":84,\\"color\\":\\"#ffedd5\\"},{\\"low\\":36,\\"high\\":64,\\"color\\":\\"#ffedd5\\"}],\\"showInLegend\\":false},{\\"name\\":\\"Increasing\\",\\"type\\":\\"columnrange\\",\\"color\\":\\"#86efac\\",\\"showInLegend\\":true,\\"data\\":[],\\"enableMouseTracking\\":false},{\\"name\\":\\"Decreasing\\",\\"zIndex\\":2,\\"borderColor\\":\\"#d4d4d8\\",\\"upColor\\":\\"#86efac\\",\\"color\\":\\"#fed7aa\\",\\"data\\":[{\\"y\\":20,\\"color\\":\\"#e4e4e7\\"},20,20,{\\"y\\":20},-20,-20,0,0,0,0,0,0,0,{\\"isSum\\":true,\\"color\\":\\"#e4e4e7\\"}]},{\\"name\\":\\"Border\\",\\"zIndex\\":2,\\"borderColor\\":\\"#d4d4d8\\",\\"type\\":\\"columnrange\\",\\"color\\":\\"transparent\\",\\"data\\":[[0,20],[16,44],[36,64],[60,80],[56,84],[36,64],null,null,null,null,null,null,null,[0,40]],\\"showInLegend\\":false}]}\\n```\\n\\n```json datapos-highcharts\\n{\\"colors\\":[\\"rgba(124, 181, 236, 0.3)\\",\\"rgba(144, 237, 125, 0.3)\\"],\\"chart\\":{\\"type\\":\\"waterfall\\"},\\"title\\":{\\"text\\":\\"Highcharts stacked waterfall (overlap)\\"},\\"tooltip\\":{\\"shared\\":true},\\"xAxis\\":{\\"categories\\":[\\"0\\",\\"1\\",\\"2\\",\\"1. Intermediate Sum\\",\\"4\\",\\"2. Intermediate Sum\\",\\"6\\",\\"Sum\\"]},\\"yAxis\\":{\\"tickInterval\\":10},\\"plotOptions\\":{\\"series\\":{\\"stacking\\":\\"overlap\\",\\"lineWidth\\":1}},\\"series\\":[{\\"zIndex\\":1,\\"upColor\\":{\\"pattern\\":{\\"color\\":\\"#15af15\\",\\"width\\":20,\\"height\\":20,\\"opacity\\":0.6,\\"path\\":{\\"d\\":\\"M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18\\",\\"strokeWidth\\":4}}},\\"color\\":{\\"pattern\\":{\\"color\\":\\"#0088ff\\",\\"width\\":20,\\"height\\":20,\\"opacity\\":0.6,\\"path\\":{\\"d\\":\\"M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18\\",\\"strokeWidth\\":4}}},\\"data\\":[20,-10,40,{\\"isIntermediateSum\\":true,\\"color\\":{\\"pattern\\":{\\"color\\":\\"#0A500A\\",\\"width\\":20,\\"height\\":20,\\"opacity\\":0.6,\\"path\\":{\\"d\\":\\"M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18\\",\\"strokeWidth\\":4}}}},-10,{\\"isIntermediateSum\\":true,\\"color\\":{\\"pattern\\":{\\"color\\":\\"#003E74\\",\\"width\\":20,\\"height\\":20,\\"opacity\\":0.6,\\"path\\":{\\"d\\":\\"M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18\\",\\"strokeWidth\\":4}}}},-20,{\\"isSum\\":true,\\"color\\":{\\"pattern\\":{\\"color\\":\\"#0A500A\\",\\"width\\":20,\\"height\\":20,\\"opacity\\":0.6,\\"path\\":{\\"d\\":\\"M 0 20 L 20 0 M -2 2 L 2 -2 M 18 22 L 22 18\\",\\"strokeWidth\\":4}}}}]},{\\"zIndex\\":0,\\"upColor\\":\\"rgba(21, 175, 21, 0.3)\\",\\"color\\":\\"rgba(0, 136, 255, 0.3)\\",\\"data\\":[20,40,-10,{\\"isIntermediateSum\\":true,\\"color\\":\\"rgba(10, 80, 10, 0.3)\\"},30,{\\"isIntermediateSum\\":true,\\"color\\":\\"rgba(10, 80, 10, 0.3)\\"},-20,{\\"isSum\\":true,\\"color\\":\\"rgba(10, 80, 10, 0.3)\\"}]}]}\\n```\\n\\n## Explanatory Notes\\n\\n! [](./hc.svg)\\n\\nChanges in headcount during a period obviously imply that people are joining and leaving the workforce.\\n\\nWe can visualise the headcount ranges for each period, and the progression from one period to the next, using a floating column chart.\\n\\nGreen columns represent a net increase in headcount for a period. Orange columns represent a net decrease in headcount. The wider light green/orange columns show opening/closing ranges while the narrower dark green/orange columns show starting/ending ranges.\\n\\nThe bottom of each green column represents the opening or starting headcount for a period of increase. The top the ending or closing headcount. The top of each orange column represents the opening or starting headcount for a period of decline. The bottom the ending or closing headcount.\\n\\nThe problem with this charts is that to provides no understanding of the volume of hires and terminations within each period.\\n\\nThese measures quantify the number of people (physical/actual) available for work at a specific point in time. A good example is Ending Headcount – the number of people employed/contracted at the end of a given period.\\n\\nWhereas it is possible to calculate headcount for any period, practical options include hours, days, months, quarters and years.\\n\\nExperience shows that we use two sets of point in time headcount measures:\\n\\nOpen/Closing headcounts and,\\nStarting/Ending headcounts.\\nOpening Headcount quantifies the number of people brought forward from the previous period. Closing Headcount quantifies the number of people carried forward into the next period.\\n\\nStarting Headcount quantifies the number of people available for work from the start of a period. This measure includes people who were available for work from the beginning of a period but were not brought forward from the previous period (i.e. joined the workforce in the respective period). Ending Headcount represents the number of people available for work until the end of a period. This measure includes people who worked until the end of the period but were not carried forward into the next period (i.e. left the workforce in the respective period).\\n\\nAn accountant may think in terms of brought/carry forward counts (i.e. reconciling headcounts from one period to the next). A manager may think in terms of start/end counts (i.e. the number of people available for work).\\n\\nThe following simple line chart presents the monthly point in time headcounts for a given year. It is useful for displaying one maybe two measures but becomes confusing if we show more. You can click on the legend items to show/hide individual measures.\\n\\nThe challenge with this chart is that whereas we can quickly determine the change in individual measures across time, it is difficult to understand the relationships between them.\\n\\n---\\n\\nThis chart displays \'point in time\' headcounts by month for a given calendar year using a line chart from the Chart.js library.\\n\\nIt includes all four \'point in time\' measures (Opening Headcount, Starting Headcount, Ending Headcount and Closing Headcount). Initially, only Ending Headcount is visible. You can click the legend items to toggle the visibility of individual measures.\\n\\nIt excels at visualising a single headcount measure over time. It can also be used to compare multiple headcounts but quickly becomes confusing if three or more are visible at once.\\n\\nA non-zero baseline is preferred in this case to emphasise the change in headcount values over time.\\n\\nArea, bar and radar versions are also possible.\\n\\n---\\n\\nThe actual (physical) number of people in the workforce at a specific point in time. Values are calculated in terms of reporting periods (days, shifts, rotations, pay periods, weeks, fortnights, 4 week durations, months, quarters, years...). Opening/closing values represent the headcount as a period opens (bring forward) and closes (carry forward). Starting/ending values represent the headcount at the point the period starts and ends.\\n\\n```javascript\\nconst items = [];\\nlet count = 0;\\nfor (const item of items) {\\n    count++;\\n}\\nconsole.log(\'A very long line of text that will test how the code block wraps on narrow screens, hope this works.\');\\nconsole.log(count);\\n```\\n\\n```json datapos-formula\\n{\\"expression\\":\\"Termination Rate=Average Headcount/Terminations*100\'\\"}\\n```\\n\\n> A blockquote...\\n\\n- Unordered list 1\\n- Unordered list 2\\n- Unordered list 3\\n- Unordered list 4\\n- Unordered list 5\\n\\n1. Ordered list 1\\n1. Unordered list 2\\n1. Unordered list 3\\n1. Unordered list 4\\n1. Unordered list 5\\n\\n| Col 1       | Col 2       |\\n| ----------- | ----------- |\\n| Row 1 Val 1 | Row 1 Val 2 |\\n| Row 2 Val 1 | Row 2 Val 2 |\\n| Row 3 Val 1 | Row 3 Val 2 |\\n| Row 4 Val 1 | Row 4 Val 2 |\\n| Row 5 Val 1 | Row 5 Val 2 |\\n"}')
}, x = [{ month: 1, openingHeadcount: 1105, openingFTE: 0, startingHires: 0, startingFTE: 0, hires: 23, newHires: 22, rehires: 1, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 18, averageHeadcount: 1108.1935483870966, fte: 1090.2701774193545, endingFTE: 0, endingTerminations: 2, closingFTE: 0, closingHeadcount: 1110 }, { month: 2, openingHeadcount: 1110, openingFTE: 0, startingHires: 1, startingFTE: 0, hires: 18, newHires: 14, rehires: 4, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 19, averageHeadcount: 1113.4482758620695, fte: 1095.128286206897, endingFTE: 0, endingTerminations: 1, closingFTE: 0, closingHeadcount: 1109 }, { month: 3, openingHeadcount: 1109, openingFTE: 0, startingHires: 0, startingFTE: 0, hires: 38, newHires: 34, rehires: 4, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 18, averageHeadcount: 1121.967741935484, fte: 1103.577693548387, endingFTE: 0, endingTerminations: 5, closingFTE: 0, closingHeadcount: 1129 }, { month: 4, openingHeadcount: 1129, openingFTE: 0, startingHires: 3, startingFTE: 0, hires: 22, newHires: 22, rehires: 0, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 22, averageHeadcount: 1132.3999999999996, fte: 1114.0404999999998, endingFTE: 0, endingTerminations: 5, closingFTE: 0, closingHeadcount: 1129 }, { month: 5, openingHeadcount: 1129, openingFTE: 0, startingHires: 1, startingFTE: 0, hires: 26, newHires: 24, rehires: 2, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 21, averageHeadcount: 1134.7419354838717, fte: 1114.941145161291, endingFTE: 0, endingTerminations: 2, closingFTE: 0, closingHeadcount: 1134 }, { month: 6, openingHeadcount: 1134, openingFTE: 0, startingHires: 17, startingFTE: 0, hires: 63, newHires: 58, rehires: 5, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 25, averageHeadcount: 1160.333333333332, fte: 1139.8760233333317, endingFTE: 0, endingTerminations: 4, closingFTE: 0, closingHeadcount: 1172 }, { month: 7, openingHeadcount: 1172, openingFTE: 0, startingHires: 2, startingFTE: 0, hires: 42, newHires: 38, rehires: 4, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 41, averageHeadcount: 1175.5483870967737, fte: 1155.5572387096768, endingFTE: 0, endingTerminations: 4, closingFTE: 0, closingHeadcount: 1173 }, { month: 8, openingHeadcount: 1173, openingFTE: 0, startingHires: 1, startingFTE: 0, hires: 37, newHires: 32, rehires: 5, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 34, averageHeadcount: 1180.0967741935488, fte: 1160.2840935483875, endingFTE: 0, endingTerminations: 0, closingFTE: 0, closingHeadcount: 1176 }, { month: 9, openingHeadcount: 1176, openingFTE: 0, startingHires: 16, startingFTE: 0, hires: 41, newHires: 38, rehires: 3, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 31, averageHeadcount: 1189.5999999999995, fte: 1170.280466666666, endingFTE: 0, endingTerminations: 6, closingFTE: 0, closingHeadcount: 1186 }, { month: 10, openingHeadcount: 1186, openingFTE: 0, startingHires: 4, startingFTE: 0, hires: 23, newHires: 21, rehires: 2, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 20, averageHeadcount: 1190.0000000000002, fte: 1170.4818612903225, endingFTE: 0, endingTerminations: 0, closingFTE: 0, closingHeadcount: 1189 }, { month: 11, openingHeadcount: 1189, openingFTE: 0, startingHires: 0, startingFTE: 0, hires: 45, newHires: 44, rehires: 1, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 21, averageHeadcount: 1199.866666666667, fte: 1180.5033666666668, endingFTE: 0, endingTerminations: 4, closingFTE: 0, closingHeadcount: 1213 }, { month: 12, openingHeadcount: 1213, openingFTE: 0, startingHires: 1, startingFTE: 0, hires: 13, newHires: 13, rehires: 0, inPeriodHeadcount: 0, distinctPeriodHeadcount: 0, terminations: 15, averageHeadcount: 1216.0645161290317, fte: 1196.9270225806447, endingFTE: 0, endingTerminations: 6, closingFTE: 0, closingHeadcount: 1211 }], M = {
  months: x
};
function P() {
  return { getMeasureValues: S };
}
function S(c) {
  return M.months.map((a) => c.map((h) => A(h, a)));
}
function A(c, e) {
  switch (c) {
    case "startingHeadcount":
      return e.openingHeadcount + e.startingHires;
    case "endingHeadcount":
      return e.closingHeadcount + e.endingTerminations;
    default:
      return e[c] ?? 0;
  }
}
class R {
  config;
  // TODO: If we remove list method, then config is not needed. Would make presenter slightly smaller.
  colorModeId;
  valueTable;
  sampleData;
  toolConfigs;
  highchartsTool;
  micromarkTool;
  constructor(e, a) {
    this.config = k, this.toolConfigs = e, this.colorModeId = a, this.valueTable = w(), this.sampleData = P();
  }
  // Operations - List. TODO: Is this needed? Is 'configPresentations.json' needed????
  list() {
    return this.config.presentations;
  }
  // Operations - Render.
  async render(e, a, h) {
    const u = E[e];
    let m = u.content;
    m = m.replace(/\{\{label\}\}/g, u.label?.["en-gb"] ?? "{{label}}").replace(/\{\{description\}\}/g, u.description?.["en-gb"] ?? "{{description}}"), this.micromarkTool = await this.loadMicromarkTool();
    const b = await this.micromarkTool.render(m, { tables: !0 });
    a.innerHTML = b, this.micromarkTool.highlight(a, this.colorModeId), this.highchartsTool = await this.loadHighchartsTool();
    for (const g of a.querySelectorAll(".datapos-highcharts")) {
      const f = decodeURIComponent(g.dataset.options), t = JSON.parse(f), s = document.createElement("div");
      g.appendChild(s), this.highchartsTool.render(t, s);
    }
    for (const g of a.querySelectorAll(".datapos-visual")) {
      const f = decodeURIComponent(g.dataset.options);
      try {
        const t = JSON.parse(f);
        if (!h)
          for (const d of t.content.data.measures)
            d.values = this.sampleData.getMeasureValues([d.id]);
        const s = document.createElement("div");
        s.className = "dp-tab-bar";
        const i = document.createElement("div");
        let p, r;
        for (const d of t.views) {
          const l = d.categoryId;
          switch (l) {
            case "cartesianChart": {
              const o = d;
              (!r || o.default) && (p = l, r = o.typeId);
              const n = document.createElement("div");
              n.textContent = o.typeId, n.addEventListener(
                "click",
                () => this.highchartsTool.renderCartesianChart(o.typeId, t.content, i)
              ), s.appendChild(n);
              break;
            }
            case "periodFlowBoundariesChart": {
              (!r || d.default) && (p = l, r = void 0);
              const n = document.createElement("div");
              n.textContent = l, n.addEventListener("click", () => this.highchartsTool.renderPeriodFlowBoundaries(t.content, i)), s.appendChild(n);
              break;
            }
            case "polarChart": {
              const o = d;
              (!r || o.default) && (p = l, r = o.typeId);
              const n = document.createElement("div");
              n.textContent = o.typeId, n.addEventListener("click", () => this.highchartsTool.renderPolarChart(o.typeId, t.content, i)), s.appendChild(n);
              break;
            }
            case "rangeChart": {
              const o = d;
              (!r || o.default) && (p = l, r = o.typeId);
              const n = document.createElement("div");
              n.textContent = o.typeId, n.addEventListener("click", () => this.highchartsTool.renderRangeChart(o.typeId, t.content, i)), s.appendChild(n);
              break;
            }
            case "valueTable": {
              (!r || d.default) && (p = l, r = void 0);
              const n = document.createElement("div");
              n.textContent = l, n.addEventListener("click", () => this.valueTable.render(t.content, i)), s.appendChild(n);
              break;
            }
          }
        }
        switch (g.appendChild(s), g.appendChild(i), p) {
          case "cartesianChart":
            this.highchartsTool.renderCartesianChart(r, t.content, i);
            break;
          case "periodFlowBoundariesChart":
            this.highchartsTool.renderPeriodFlowBoundaries(t.content, i);
            break;
          case "polarChart":
            this.highchartsTool.renderPolarChart(r, t.content, i);
            break;
          case "rangeChart":
            this.highchartsTool.renderRangeChart(r, t.content, i);
            break;
          case "valueTable":
            this.valueTable.render(t.content, i);
            break;
        }
      } catch (t) {
        console.error(t), g.textContent = "Invalid options.";
      }
    }
  }
  // Operations - Set color mode.
  setColorMode(e) {
    this.colorModeId = e, this.micromarkTool && this.micromarkTool.setColorMode(this.colorModeId);
  }
  // Helpers - Load Highcharts tool.
  async loadHighchartsTool() {
    if (this.highchartsTool) return this.highchartsTool;
    const e = this.toolConfigs.find((u) => u.id === "datapos-tool-highcharts");
    if (!e) return;
    const h = (await import(`https://engine-eu.datapos.app/tools/highcharts_v${e.version}/datapos-tool-highcharts.es.js`)).HighchartsTool;
    return new h();
  }
  // Helpers - Load Micromark tool.
  async loadMicromarkTool() {
    if (this.micromarkTool) return this.micromarkTool;
    const e = this.toolConfigs.find((u) => u.id === "datapos-tool-micromark");
    if (!e) return;
    const h = (await import(`https://engine-eu.datapos.app/tools/micromark_v${e.version}/datapos-tool-micromark.es.js`)).MicromarkTool;
    return new h();
  }
}
export {
  R as default
};
