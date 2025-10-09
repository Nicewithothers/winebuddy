import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/User';
import { VineyardRequest } from '../models/requests/VineyardRequest';
import { VineyardResponse } from '../models/responses/VineyardResponse';

@Injectable({
    providedIn: 'root',
})
export class VineyardService {
    private apiURL: string = 'http://localhost:8080/api/vineyard';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {}

    createVineyard(vineyard: VineyardRequest): Observable<User> {
        return this.http
            .post(`${this.apiURL}/createVineyard`, vineyard, {
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        const user = response.body as User;
                        this.authService.userSubject.next(user);
                        return user;
                    } else {
                        throw new Error('Error creating Vineyard');
                    }
                }),
                catchError(err => {
                    console.error(err);
                    throw new Error('Unable to create vineyard');
                }),
            );
    }

    deleteVineyard(id: number) {
        return this.http
            .delete(`${this.apiURL}/deleteVineyard/` + id, {
                params: { id },
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        const user = response.body as User;
                        this.authService.userSubject.next(user);
                        return user;
                    } else {
                        throw new Error('Error deleting Vineyard');
                    }
                }),
                catchError(err => {
                    console.error(err);
                    throw new Error('Unable to delete Vineyard');
                }),
            );
    }

    validateVineyard(layer: any) {
        return this.http
            .post(`${this.apiURL}/validateVineyard`, layer, {
                observe: 'response',
            })
            .pipe(
                map(response => response.body as boolean),
                catchError(err => {
                    console.error(err);
                    throw new Error('Vineyard cannot be validated.');
                }),
            );
    }
}
