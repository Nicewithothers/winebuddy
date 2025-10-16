import { Cellar } from './Cellar';
import { Grape } from './Grape';
import { BarrelType } from './enums/barrel/BarrelType';
import { BarrelSize } from './enums/barrel/BarrelSize';

export interface Barrel {
    id: number;
    volume: number;
    maxVolume: number;
    barrelType: BarrelType;
    barrelSize: BarrelSize;
    cellar: Cellar;
    grape: Grape | null;
}
