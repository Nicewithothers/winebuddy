import { Barrel } from './Barrel';
import { Grapevine } from './Grapevine';

export interface Grape {
    id: number;
    grapeType: string;
    grapeSweetness: number;
    grapeColor: string;
    grapeGrowthTime: number;
    barrels: Barrel[] | null;
    grapevines: Grapevine[] | null;
}
