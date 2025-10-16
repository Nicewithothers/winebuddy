import { Barrel } from './Barrel';
import { GrapeType } from './enums/grape/GrapeType';
import { GrapeTaste } from './enums/grape/GrapeTaste';

export interface Grape {
    id: number;
    name: string;
    grapeType: GrapeType;
    grapeTaste: GrapeTaste;
    region: string;
    barrels: Barrel[] | null;
}
