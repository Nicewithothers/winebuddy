export enum BarrelType {
    FRENCH_OAK = 'French Oak',
    AMERICAN_OAK = 'American Oak',
    HUNGARIAN_OAK = 'Hungarian Oak',
    SLAVONIAN_OAK = 'Slavonian Oak',
    GERMAN_OAK = 'German Oak',
    ACACIA = 'Acacia',
    CHERRY = 'Cherry',
    PINE = 'Pine',
}

export const barrelTypes = Object.entries(BarrelType).map(([value, label]) => ({
    value: value,
    label: label,
}));
