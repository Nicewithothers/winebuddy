import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    public currentUser$: Observable<User | null> = this.currentUser.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    getUser(): Observable<User | null> {
        const token = sessionStorage.getItem('token') as string;
        const headers = new HttpHeaders({ Authorization: token });

        return this.http
            .get<User>(`${this.authPath}/getUser`, { headers, observe: 'response' })
            .pipe(
                map((response: any) => {
                    if (response.ok && response.body) {
                        const user = response.body as User;
                        this.currentUser.next(user);
                        return user;
                    } else {
                        throw new Error('User not found');
                    }
                }),
                catchError(err => {
                    console.error(err);
                    this.currentUser.next(null);
                    return of(null);
                }),
            );
    }

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
                const token = response.headers.get('Authorization') as string;
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
        this.router.navigate(['/']).then(() => {
            toast.success('Logged out successfully!', {
                position: 'bottom-center',
            });
        });
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
}
