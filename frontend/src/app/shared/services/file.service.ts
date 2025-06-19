import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { User } from '../models/User';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private authPath: string = 'http://localhost:8080/api/files';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {}

    uploadProfile(username: string, file: File): Observable<User> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http
            .post<User>(`${this.authPath}/${username}/changeProfile`, formData, {
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        const user = response.body as User;
                        sessionStorage.setItem('User', JSON.stringify(user));
                        this.authService.userSubject.next(user);
                        return response.body as User;
                    } else {
                        throw new Error('Unable to upload file');
                    }
                }),
                catchError(err => {
                    console.error(err);
                    throw new Error('Unable to upload file');
                }),
            );
    }
}
