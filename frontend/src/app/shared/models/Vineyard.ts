import { User } from './User';
import { Cellar } from './Cellar';

export interface Vineyard {
    id: number;
    name: string;
    mapArea: any;
    owningDate: string;
    area: number;
    owner: User;
    cellars?: Cellar[];
}
