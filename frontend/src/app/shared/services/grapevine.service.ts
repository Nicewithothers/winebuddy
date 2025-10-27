import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, map, Observable } from 'rxjs';
import { User } from '../models/User';
import { GrapevineRequest } from '../models/requests/GrapevineRequest';
import { GeoJSON } from 'leaflet';

@Injectable({
    providedIn: 'root',
})
export class GrapevineService {
    private apiURL = 'http://localhost:8080/api/grapevine';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {}

    createGrapevine(grapevine: any): Observable<User> {
        return this.http
            .post(`${this.apiURL}/createGrapevine`, grapevine, {
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    const user = response.body as User;
                    this.authService.userSubject.next(user);
                    return user;
                }),
                catchError(err => {
                    console.error(err);
                    throw new Error('Unable to create Grapevine');
                }),
            );
    }

    setGrapetoGrapeVine(id: number, grapeType: string) {
        return this.http
            .patch(`${this.apiURL}/setGrapeToGrapevine/${id}`, grapeType, {
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    const user = response.body as User;
                    this.authService.userSubject.next(user);
                    return user;
                }),
                catchError(err => {
                    console.error(err);
                    throw new Error('');
                }),
            );
    }

    validateGrapevine(layer: GeoJSON) {
        return this.http
            .post(`${this.apiURL}/validateGrapevine`, layer, {
                observe: 'response',
            })
            .pipe(
                map(response => {
                    return response.body as boolean;
                }),
                catchError(err => {
                    console.error(err);
                    throw new Error('Grapevine cannot be validated.');
                }),
            );
    }
}
