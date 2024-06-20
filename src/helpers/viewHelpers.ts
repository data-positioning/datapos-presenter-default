export type ColorConfig = { border: string; fillOpaque?: string; fillTranslucent: string };

export const Colors: Record<string, ColorConfig> = {
    axis: { border: '#F2F2F2', fillTranslucent: '#F2F2F2' },
    blue: { border: '#36A2EB', fillTranslucent: '#24A2EB80' },
    darkGrey: { border: '#6B7280', fillTranslucent: '#6B728080' },
    fillAbove: { border: '#BBF7D080', fillTranslucent: '#BBF7D080' },
    fillBelow: { border: '#FEF08A80', fillTranslucent: '#FEF08A80' },
    green: { border: '#4BC0C0', fillTranslucent: '#4BC0C080' },
    grey: { border: '#C9CBCE', fillTranslucent: '#C9CBCE80' },
    negative: { border: '#FF9F40', fillOpaque: '#FFD0A8', fillTranslucent: '#FF9F4080' },
    orange: { border: '#FF9F40', fillTranslucent: '#FF9F4080' },
    pink: { border: '#FF6384', fillTranslucent: '#FF636C80' },
    positive: { border: '#4BC0C0', fillOpaque: '#ABE0E0', fillTranslucent: '#4BC0C080' },
    purple: { border: '#9966FF', fillTranslucent: '#9966FF80' },
    transparent: { border: 'transparent', fillTranslucent: 'transparent' },
    yellow: { border: '#FFCD56', fillTranslucent: '#FFCD5680' }
};

export const Patterns = [
    { path: { d: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5', strokeWidth: 1 }, height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5', height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 2 0 L 2 5 M 4 0 L 4 5', height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 0 2 L 5 2 M 0 4 L 5 4', height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 0 1.5 L 2.5 1.5 L 2.5 0 M 2.5 5 L 2.5 3.5 L 5 3.5', height: 5, patternTransform: 'scale(1.4 1.4)', width: 5 },
    { path: 'M 0 0 L 5 10 L 10 0', height: 10, width: 10 },
    { path: 'M 3 3 L 8 3 L 8 8 L 3 8 Z', height: 10, width: 10 },
    { path: 'M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0', height: 10, width: 10 },
    { path: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11', height: 10, width: 10 },
    { path: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9', height: 10, width: 10 }
];

export const SeriesColors: ColorConfig[] = [
    { fillTranslucent: Colors.blue.fillTranslucent, border: Colors.blue.border },
    { fillTranslucent: Colors.pink.fillTranslucent, border: Colors.pink.border },
    { fillTranslucent: Colors.yellow.fillTranslucent, border: Colors.yellow.border },
    { fillTranslucent: Colors.orange.fillTranslucent, border: Colors.orange.border },
    { fillTranslucent: Colors.purple.fillTranslucent, border: Colors.purple.border },
    { fillTranslucent: Colors.green.fillTranslucent, border: Colors.green.border },
    { fillTranslucent: Colors.grey.fillTranslucent, border: Colors.grey.border }
];

export interface View {
    resize: () => void;
    vendorId: string;
}

export interface Config {
    id: string;
    label: string;
    chartTypeIds?: string[];
    populate: (container?: HTMLElement) => Promise<View>;
}
