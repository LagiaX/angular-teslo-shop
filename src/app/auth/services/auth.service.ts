import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl: string = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _http: HttpClient = inject(HttpClient);

  private _authStatus: WritableSignal<AuthStatus> = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  public authStatus: Signal<AuthStatus> = computed<AuthStatus>(() => this._authStatus());
  public user: Signal<User | null> = computed<User | null>(() => this._user());
  public token: Signal<string | null> = computed<string | null>(() => this._token());
  public isAdmin: Signal<boolean> = computed(() => {
    return !!this._user() ? this._user()!.roles.includes('admin') : false;
  });

  public checkAuthToken = rxResource({
    stream: () => this.checkStatus()
  });

  public login(email: string, password: string): Observable<boolean> {
    return this._http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email,
      password
    }).pipe(
      map((resp: AuthResponse) => this._handleAuthSuccess(resp)),
      catchError((error: Error) => this._handleAuthError(error))
    );
  }

  public checkStatus(): Observable<boolean> {
    const token: string | null = this._token();
    if (!token) {
      this.logout();
      return of(false);
    }

    return this._http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
      map((resp: AuthResponse) => this._handleAuthSuccess(resp)),
      catchError((error: Error) => this._handleAuthError(error))
    );
  }

  public registerAccount(fullName: string, email: string, password: string): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      fullName,
      email,
      password
    });
  }

  public logout(): void {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  private _handleAuthSuccess({ user, token }: AuthResponse): boolean {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    localStorage.setItem('token', token);
    return true;
  }

  private _handleAuthError(error: Error): Observable<boolean> {
    console.log(error.message);
    this.logout();
    return of(false);
  }
}
