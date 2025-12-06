import { Grape } from './Grape';

export interface Wine {
    id: number;
    name: string;
    yearOfCreation: number;
    alcoholPercentage: number;
    quantity: number;
    grapes: Grape[];
}
