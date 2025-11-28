export enum GrapeColor {
    RED = 'Red',
    WHITE = 'White',
}

export const grapeColors = Object.entries(GrapeColor).map(([value, label]) => ({
    value: value,
    label: label,
}));
