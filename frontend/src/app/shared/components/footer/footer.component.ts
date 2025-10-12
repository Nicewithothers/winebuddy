import { Component } from '@angular/core';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
    selector: 'app-footer',
    imports: [HlmMenuImports],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    standalone: true,
})
export class FooterComponent {}
