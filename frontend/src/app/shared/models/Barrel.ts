import { Cellar } from './Cellar';
import { Grape } from './Grape';
import { BarrelType } from './enums/BarrelType';
import { BarrelSize } from './enums/BarrelSize';

export interface Barrel {
    volume: number;
    maxVolume: number;
    barrelType: BarrelType;
    barrelSize: BarrelSize;
    cellar: Cellar;
    grape: Grape;
}
