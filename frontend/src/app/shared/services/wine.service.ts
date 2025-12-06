import { Injectable } from '@angular/core';
import { BarrelRequest } from '../models/requests/BarrelRequest';
import { catchError, map, Observable } from 'rxjs';
import { User } from '../models/User';
import { WineRequest } from '../models/requests/WineRequest';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class WineService {
    private winePath: string = 'http://localhost:8080/api/wine';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {}

    createWines(wineRequest: WineRequest): Observable<User> {
        return this.http
            .post(`${this.winePath}/createWines`, wineRequest, {
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
}
