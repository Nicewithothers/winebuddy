import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 0) {
                toast.error('Server is down! Please try again later.', {
                    position: 'bottom-center',
                });
                return of(null as any);
            }
            return throwError(() => error);
        }),
    );
};
