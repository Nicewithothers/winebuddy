export enum BarrelType {
    BARRIQUE = 'BARRIQUE',
    TONNEAU = 'TONNEAU',
    PUNCHEON = 'PUNCHEON',
    QUARTAUT = 'QUARTAUT',
    DEMI_MUID = 'DEMI_MUID',
    FOUDRE = 'FOUDRE',
    GONC = 'GONC',
}

export const BarrelTypeTransform = {
    [BarrelType.BARRIQUE]: 'Barrique',
    [BarrelType.TONNEAU]: 'Tonneau',
    [BarrelType.PUNCHEON]: 'Puncheon',
    [BarrelType.QUARTAUT]: 'Quartaut',
    [BarrelType.DEMI_MUID]: 'Demi Muid',
    [BarrelType.FOUDRE]: 'Foudre',
    [BarrelType.GONC]: 'Gonc'
}
