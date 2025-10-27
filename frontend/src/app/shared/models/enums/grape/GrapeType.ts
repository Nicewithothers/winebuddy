export enum GrapeType {
    CHARDONNAY = 'Chardonnay',
    SAUVIGNON_BLANC = 'Sauvignon Blanc',
    SYRAH = 'Syrah',
    CABERNET_SAUVIGNON = 'Cabernet Sauvignon',
    CABERNET_FRANC = 'Cabernet Franc',
    MERLOT = 'Merlot',
    PINOT_NOIR = 'Pinot Noir',
    RIESLING = 'Riesling',
    MUSCAT = 'Muscat',
}

export const grapeTypes = Object.entries(GrapeType).map(([value, label]) => ({
    value: value,
    label: label,
}));
