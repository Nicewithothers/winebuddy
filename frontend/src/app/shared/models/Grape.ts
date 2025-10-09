import { Barrel } from './Barrel';

export interface Grape {
    id: number;
    name: string;
    grapeType: GrapeType;
    grapeTaste: GrapeTaste;
    region: string;
    barrels: Barrel[] | null;
}

export enum GrapeType {
    CHARDONNAY = 'CHARDONNAY',
    SAUVIGNON_BLANC = 'SAUVIGNON_BLANC',
    SYRAH = 'SYRAH',
    CABERNET_SAUVIGNON = 'CABERNET_SAUVIGNON',
    CABERNET_FRANC = 'CABERNET_FRANC',
    MERLOT = 'MERLOT',
    PINOT_NOIR = 'PINOT_NOIR',
    RIESLING = 'RIESLING',
    MUSCAT = 'MUSCAT',
}

export enum GrapeTaste {
    SWEET = 'SWEET',
    HALF_SWEET = 'HALF_SWEET',
    HALF_DRY = 'HALF_DRY',
    DRY = 'DRY',
}
