import headcountForCalendarYear from './sampleData/humanResources/workforce/headcountForCalendarYear.json';

export { headcountForCalendarYear };

export const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Measure {
    id: string;
    source: (row: Record<string, number>) => number;
}
type MeasureValueMap = Record<string, number[]>;

export const buildMeasureMap = (data: Record<string, number>[], measures: Measure[]): MeasureValueMap => {
    return data.reduce((result, row) => {
        measures.forEach((measure) => {
            if (measure.source)
                if (typeof measure.source === 'function') result[measure.id].push(measure.source(row));
                else result[measure.id].push(row[String(measure.source)]);
            else result[measure.id].push(row[measure.id]);
        });
        return result;
    }, buildEmptyMeasureValueMap(measures));
};

export const buildProgressionData = () => {
    const data = {
        broughtForwardHeadcounts1: new Array(14).fill(null),
        broughtForwardHeadcounts2: new Array(14).fill(null),
        openingHeadcount: new Array(14).fill(null),
        hires: new Array(14).fill(null),
        //startingHires: new Array(14).fill(null),
        averageHeadcounts: new Array(14).fill(null),
        offsets: new Array(14).fill(null),
        //endingTerminations: new Array(14).fill(null),
        terminations: new Array(14).fill(null),
        closingHeadcount: new Array(14).fill(null),
        carryForwardHeadcounts1: new Array(14).fill(null)
        // carryForwardHeadcounts2: new Array(14).fill(null)
    };
    data.terminations[0] = { y: 0, borderColor: 'transparent' };
    data.terminations[13] = { y: 0, borderColor: 'transparent' };
    for (const [month, record] of headcountForCalendarYear.months.entries()) {
        if (month === 0) {
            data.broughtForwardHeadcounts1[0] = record.openingHeadcount;
            data.broughtForwardHeadcounts2[0] = record.openingHeadcount + record.hires;
        }
        if (month > 0) {
            data.offsets[month] = record.hires;
        }
        if (month === 11) {
            data.carryForwardHeadcounts1[month + 2] = record.closingHeadcount * -1;
            // data.carryForwardHeadcounts2[month + 2] = record.closingHeadcount * -1;
        }
        data.hires[month + 1] = record.hires;
        data.averageHeadcounts[month + 1] = record.averageHeadcount;
        data.openingHeadcount[month + 1] = record.openingHeadcount;
        data.closingHeadcount[month + 1] = record.closingHeadcount;
        data.terminations[month + 1] = record.terminations * -1;
    }
    return { ...data };
};

export const buildWaterfallData = () => {
    const data = {
        openingHeadcounts1: new Array(14).fill(null),
        // openingHeadcounts2: new Array(14).fill(null),
        hires: new Array(14).fill(null),
        startingHires: new Array(14).fill(null),
        averageHeadcounts: new Array(14).fill(null),
        // offsets: new Array(14).fill(null),
        endingTerminations: new Array(14).fill(null),
        terminations: new Array(14).fill(null),
        closingHeadcounts: new Array(14).fill(null)
    };
    for (const [month, record] of headcountForCalendarYear.months.entries()) {
        if (month === 0) {
            data.openingHeadcounts1[0] = record.openingHeadcount;
            // data.openingHeadcounts2[0] = record.openingHeadcount + record.hires;
        }
        // if (month > 0) {
        //   data.offsets[month] = record.hires;
        // }
        if (month === 11) {
            data.closingHeadcounts[month + 2] = record.closingHeadcount * -1;
        }
        data.hires[month + 1] = record.hires - record.startingHires;
        data.startingHires[month + 1] = record.startingHires;
        data.averageHeadcounts[month + 1] = record.averageHeadcount;
        data.endingTerminations[month + 1] = record.endingTerminations * -1;
        data.terminations[month + 1] = (record.terminations - record.endingTerminations) * -1;
    }
    return { ...data };
};

const buildEmptyMeasureValueMap = (measures: Measure[]): MeasureValueMap => measures.reduce((result, measure) => ({ ...result, [measure.id]: [] }), {});
