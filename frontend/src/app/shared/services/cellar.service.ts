import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, map, Observable } from 'rxjs';
import { User } from '../models/User';
import { CellarRequest } from '../models/cellar/CellarRequest';

@Injectable({
    providedIn: 'root',
})
export class CellarService {
    private apiURL: string = 'http://localhost:8080/api/cellar';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {}

    createCellar(cellar: CellarRequest): Observable<User> {
        const token = sessionStorage.getItem('AuthToken');
        const headers = new HttpHeaders({ Authorization: `${token}` });
        return this.http
            .post(`${this.apiURL}/createCellar`, cellar, {
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
}
