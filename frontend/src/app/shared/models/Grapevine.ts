import { Grape } from './Grape';

export interface Grapevine {
    id: number;
    geometry: any;
    length: number;
    created: string;
    grapeDueDate: string;
    grape: Grape | null;
}
