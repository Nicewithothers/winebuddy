import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {BehaviorSubject, catchError, map, Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {AuthRequest} from '../models/authrequest.model';
import {AuthResponse} from '../models/authresponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = 'http://localhost:8080/api/auth';
  private storedUser = new BehaviorSubject<any>(this.loadUserFromStorage());
  public user$: Observable<User> = this.storedUser.asObservable();

  constructor(private http: HttpClient) {
  }

  private loadUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  login (credentials: AuthRequest): Observable<User | null> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        this.storeUser(response.token, response.user);
        return response.user;
      }),
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }

  logout(): void {
    const token = localStorage.getItem('user');
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe();
    }
  }

  storeUser(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.storedUser.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  cleanStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.storedUser.next(null);
  }
}
