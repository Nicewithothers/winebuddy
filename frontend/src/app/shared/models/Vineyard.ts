import { User } from './User';
import { Cellar } from './Cellar';
import { Grapevine } from './Grapevine';
import { Wine } from './Wine';

export interface Vineyard {
    id: number;
    name: string;
    mapArea: any;
    owningDate: string;
    area: number;
    owner: User;
    cellars?: Cellar[];
    grapevines?: Grapevine[];
    wines?: Wine[];
}
