// Dependencies - Data.
import headcountForCalendarYear from '@/sampleData/headcountForCalendarYear.json';

// Types
type MonthData = Record<string, number>;

// Composables - Use sample data.
export function useSampleData() {
    // Operations - Get measure values.
    function getMeasureValues(ids: string[]): number[][] {
        const monthData: MonthData[] = headcountForCalendarYear.months;
        return monthData.map((month) => ids.map((id) => getMeasureValue(id, month)));
    }

    // Utilities - Get measure value.
    function getMeasureValue(id: string, month: MonthData): number {
        switch (id) {
            case 'startingHeadcount':
                return month.openingHeadcount + month.startingHires;
            case 'endingHeadcount':
                return month.closingHeadcount + month.endingTerminations;
            default:
                return month[id] ?? 0;
        }
    }

    // Exposures
    return { getMeasureValues };
}
