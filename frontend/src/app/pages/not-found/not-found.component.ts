import { Component } from '@angular/core';
import { HlmH1 } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-not-found',
    imports: [HlmH1],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css',
    standalone: true,
})
export class NotFoundComponent {}
