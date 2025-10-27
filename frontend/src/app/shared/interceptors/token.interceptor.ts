import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenKey = 'AuthToken';
    const token = localStorage.getItem(tokenKey);

    if (token) {
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        return next(clonedReq);
    }
    return next(req);
};
