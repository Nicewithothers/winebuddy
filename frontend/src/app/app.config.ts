import {
    ApplicationConfig,
    inject,
    provideAppInitializer,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthService } from './shared/services/auth.service';
import { tokenInterceptor } from './shared/interceptors/token.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideAppInitializer(() => {
            const auth = inject(AuthService);
            return auth.initializeUser();
        }),
        provideHttpClient(withInterceptors([errorInterceptor, tokenInterceptor])),
        provideCharts(withDefaultRegisterables()),
    ],
};
