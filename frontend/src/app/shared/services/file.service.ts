import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../models/user/user';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private authPath: string = 'http://localhost:8080/api/files';

    constructor(private http: HttpClient) {}

    uploadProfile(username: string, file: File): Observable<User> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http
            .post<User>(`${this.authPath}/${username}/uploadProfile`, formData, {
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
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
