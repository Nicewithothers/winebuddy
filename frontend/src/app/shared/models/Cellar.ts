import { Vineyard } from './Vineyard';
import { Barrel } from './Barrel';

export interface Cellar {
    id: number;
    name: string;
    mapArea: any;
    owningDate: string;
    capacity: number;
    vineyard: Vineyard | null;
    barrels: Barrel[] | null;
}
