/*import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = sessionStorage.getItem('authToken');
        const authReq = authToken
            ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } })
            : req;
        return next.handle(authReq);
    }
}
*/
