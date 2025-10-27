import { Grape } from './Grape';

export interface Wine {
    id: number;
    name: string;
    year: number;
    alcoholPercentage: number;
    grapes: Grape[];
}
