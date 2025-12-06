import { Vineyard } from './Vineyard';
import { Barrel } from './Barrel';
import { Wine } from './Wine';

export interface Cellar {
    id: number;
    name: string;
    mapArea: any;
    owningDate: string;
    capacity: number;
    area: number;
    vineyard: Vineyard;
    barrels?: Barrel[];
    wines?: Wine[];
}
