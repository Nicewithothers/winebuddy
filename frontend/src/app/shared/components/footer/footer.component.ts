import { Component } from '@angular/core';
import { HlmMenuBarComponent } from '@spartan-ng/ui-menu-helm';

@Component({
    selector: 'app-footer',
    imports: [HlmMenuBarComponent],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    standalone: true,
})
export class FooterComponent {}
