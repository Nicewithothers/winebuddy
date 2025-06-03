import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, HlmToasterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: true,
})
export class AppComponent {
    title = 'winebuddy';
}
