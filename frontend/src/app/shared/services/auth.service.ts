import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, take, timer } from 'rxjs';
import { RegisterRequest } from '../models/register-request';
import { LoginRequest } from '../models/login-request';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { toast } from 'ngx-sonner';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private authPath: string = 'http://localhost:8080/api/auth';
    private currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    currentUser$: Observable<User | null> = this.currentUser.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    register(credentials: RegisterRequest): Observable<RegisterRequest | null> {
        return this.http
            .post<RegisterRequest>(`${this.authPath}/register`, credentials, {
                observe: 'response',
            })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        return response.body;
                    }
                }),
                catchError(err => {
                    console.error(err);
                    return of(null);
                }),
            );
    }

    login(credentials: LoginRequest): Observable<User | null> {
        return this.http.post(`${this.authPath}/login`, credentials, { observe: 'response' }).pipe(
            map((response: any) => {
                const token = response.headers.authorization as string;
                sessionStorage.setItem('token', token);
                if (response.ok && response.body) {
                    const user = response.body as User;
                    sessionStorage.setItem('User', user.username);
                    this.currentUser.next(user);
                    return user;
                } else {
                    throw new Error('Unauthorized');
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
        this.currentUser.next(null);
    }

    sessionHandler(): void {
        timer(1000 * 60)
            .pipe(take(1))
            .subscribe(() => {
                this.logout();
                toast.warning('Session timed out, please log in again.', {
                    position: 'bottom-center',
                });
                this.router.navigate(['/login']);
            });
    }

    isLoggedIn(): boolean {
        return this.currentUser.value !== null;
    }
}
