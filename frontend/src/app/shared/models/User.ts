import { Vineyard } from './Vineyard';

export interface User {
    username: string;
    email: string;
    role: string;
    created: string;
    profileURL: string | null;
    vineyard: Vineyard | null;
}
