import { GrapeType } from './grape/GrapeType';
import { GrapeTaste } from './grape/GrapeTaste';
import { Barrel } from './Barrel';

export interface Grape {
    id: number;
    name: string;
    grapeType: GrapeType;
    grapeTaste: GrapeTaste;
    region: string;
    barrels: Barrel[] | null;
}
