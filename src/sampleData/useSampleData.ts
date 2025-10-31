// Dependencies
import headcountForCalendarYear from './headcountForCalendarYear.json';

// Types
type MonthData = (typeof headcountForCalendarYear.months)[number];
type MeasureKey = keyof MonthData;

// Non-Reactive Variables
const measureValues: Record<string, [number, number?][]> = {};

// Composables - Use sample data.
export function useSampleData() {
    function getMeasureValues(id: MeasureKey): [number, number?][] {
        const values = measureValues[id];
        if (values) return values;
        return calcMeasureValues(id);
    }

    // Utilities - Calculate measure values.
    function calcMeasureValues(id: MeasureKey): [number, number?][] {
        measureValues[id] = headcountForCalendarYear.months.map((month) => [month[id]]);
        return measureValues[id];
    }

    // Exposures
    return { getMeasureValues };
}
