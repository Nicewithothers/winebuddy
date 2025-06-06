import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, Subject, take, timer } from 'rxjs';
import { RegisterRequest } from '../models/user/register-request';
import { LoginRequest } from '../models/user/login-request';
import { Router } from '@angular/router';
import { User } from '../models/user/user';
import { toast } from 'ngx-sonner';
import { AuthResponse } from '../models/user/auth-response';

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
    ) {
        const user = JSON.parse(sessionStorage.getItem('User') || 'null');
        if (user) {
            this.userSubject.next(user);
        }
    }

    register(credentials: RegisterRequest): Observable<User | null> {
        return this.http
            .post<RegisterRequest>(`${this.authPath}/register`, credentials, {
                observe: 'response',
                responseType: 'json',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        return response.body as User;
                    } else {
                        throw new Error('Registration failed');
                    }
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
                        const user = response.body.user as User;
                        const token = response.body.token as string;
                        sessionStorage.setItem('User', JSON.stringify(user));
                        sessionStorage.setItem('AuthToken', token);
                        this.userSubject.next(user);
                        return user;
                    } else {
                        throw new Error('Login failed');
                    }
                }),
                catchError(err => {
                    console.error(err);
                    return of(null);
                }),
            );
    }

    logout(): void {
        sessionStorage.clear();
        this.userSubject.next(null);
        this.router.navigate(['/']).then(() => {
            toast.success('Logged out successfully!', {
                position: 'bottom-center',
            });
        });
    }
}
