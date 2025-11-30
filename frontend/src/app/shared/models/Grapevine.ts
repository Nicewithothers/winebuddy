import { Grape } from './Grape';

export interface Grapevine {
    id: number;
    geometry: any;
    length: number;
    created: string;
    isMature: boolean;
    grapeDueDate: string;
    grape: Grape | null;
}
