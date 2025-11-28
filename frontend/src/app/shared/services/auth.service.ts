import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { toast } from 'ngx-sonner';
import { LoginRequest } from '../models/requests/LoginRequest';
import { RegisterRequest } from '../models/requests/RegisterRequest';
import { AuthResponse } from '../models/responses/AuthResponse';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private authPath: string = 'http://localhost:8080/api/auth';
    public userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public user$: Observable<User> = this.userSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    register(credentials: RegisterRequest): Observable<User | null> {
        return this.http
            .post<RegisterRequest>(`${this.authPath}/register`, credentials, {
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    return response.body as User;
                }),
                catchError(err => {
                    console.error(err);
                    return of(null);
                }),
            );
    }

    login(credentials: LoginRequest): Observable<User | null> {
        return this.http
            .post(`${this.authPath}/login`, credentials, {
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        const authResponse = response.body as AuthResponse;
                        const user = authResponse.user as User;
                        const token = authResponse.token as string;
                        localStorage.setItem('AuthToken', token);
                        this.userSubject.next(user);
                        return user;
                    } else {
                        throw new Error('Login failed');
                    }
                }),
                catchError(err => {
                    console.error(err);
                    this.userSubject.next(null);
                    return of(null);
                }),
            );
    }

    logout() {
        const token = this.getToken();
        return this.http
            .post<void>(`${this.authPath}/logout`, token, {
                observe: 'response',
            })
            .pipe(
                tap({
                    next: () => {
                        localStorage.clear();
                        this.userSubject.next(null);
                    },
                    error: err => {
                        console.error(err);
                    },
                }),
            );
    }

    initializeUser() {
        const token = this.getToken();
        return this.http
            .get<AuthResponse>(`${this.authPath}/getUser`, {
                observe: 'response',
            })
            .pipe(
                map(response => {
                    if (token && response.ok) {
                        const authResponse = response.body as AuthResponse;
                        const responseToken = authResponse.token as string;
                        const user = authResponse.user as User;
                        if (token !== responseToken) {
                            localStorage.removeItem('AuthToken');
                            localStorage.setItem('AuthToken', responseToken);
                        }
                        this.userSubject.next(user);
                    } else {
                        this.userSubject.next(null);
                    }
                }),
            );
    }

    private getToken(): string | null {
        return localStorage.getItem('AuthToken');
    }
}
