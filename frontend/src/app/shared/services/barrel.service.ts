import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, map, Observable } from 'rxjs';
import { User } from '../models/User';
import { BarrelRequest } from '../models/requests/BarrelRequest';

@Injectable({
    providedIn: 'root',
})
export class BarrelService {
    private apiURL: string = 'http://localhost:8080/api/barrel';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {}

    createBarrel(barrel: BarrelRequest): Observable<User> {
        return this.http
            .post(`${this.apiURL}/createBarrel`, barrel, {
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        const user = response.body as User;
                        this.authService.userSubject.next(user);
                        return user;
                    } else {
                        throw new Error('Error creating Barrel');
                    }
                }),
                catchError(err => {
                    console.error(err);
                    throw new Error('Unable to create Barrel');
                }),
            );
    }

    deleteBarrel(id: number) {
        return this.http
            .delete(`${this.apiURL}/deleteBarrel/${id}`, {
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
}
