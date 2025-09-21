import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VineyardRequest } from '../models/vineyard/VineyardRequest';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/User';
import { Point, PointTuple } from 'leaflet';
import { VineyardResponse } from '../models/vineyard/VineyardResponse';

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
        const token = sessionStorage.getItem('AuthToken');
        const headers = new HttpHeaders({ Authorization: `${token}` });
        return this.http
            .post(`${this.apiURL}/createVineyard`, vineyard, {
                headers: headers,
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        const user = response.body as User;
                        sessionStorage.setItem('User', JSON.stringify(user));
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
        const token = sessionStorage.getItem('AuthToken');
        const headers = new HttpHeaders({ Authorization: `${token}` });
        return this.http
            .delete(`${this.apiURL}/deleteVineyard/` + id, {
                params: { id },
                headers: headers,
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        const user = response.body as User;
                        sessionStorage.setItem('User', JSON.stringify(user));
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
        const token = sessionStorage.getItem('AuthToken');
        const headers = new HttpHeaders({ Authorization: `${token}` });
        return this.http
            .post(`${this.apiURL}/validateVineyard`, layer, {
                headers: headers,
                observe: 'response'
            })
            .pipe(
                map((response) => {
                    if (response) {
                        return response.body as boolean;
                    } else {
                        throw new Error('Vineyard cannot be validated!');
                    }
                }),
                catchError(err => {
                    console.error(err);
                    throw new Error('Vineyard cannot be validated.');
                })
            )
    }
}
