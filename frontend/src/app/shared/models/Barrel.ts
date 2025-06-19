import { Cellar } from './Cellar';
import { Grape } from './Grape';

export interface Barrel {
    id: number;
    name: string;
    location: any;
    volume: number;
    cellar: Cellar;
    grape: Grape;
}
