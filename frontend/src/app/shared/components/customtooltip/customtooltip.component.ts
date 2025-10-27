import { Component, Input, OnInit } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { Grapevine } from '../../models/Grapevine';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-customtooltip',
    imports: [HlmTableImports, HlmTypographyImports],
    templateUrl: './customtooltip.component.html',
    styleUrl: './customtooltip.component.css',
})
export class CustomtooltipComponent implements OnInit {
    @Input() inputGrapevine!: Grapevine | null;

    timeRemaining: string = '';

    constructor() {}

    ngOnInit(): void {
        this.startTimer();
    }

    startTimer(): void {
        this.timeRemaining = this.calculateTimeRemaining();
    }

    calculateTimeRemaining(): string {
        if (!this.inputGrapevine) {
            return '';
        }

        const now = new Date();
        const currentState = new Date(this.inputGrapevine.grapeDueDate);
        const timeleft = currentState.getTime() - now.getTime();

        if (timeleft <= 0) {
            return 'Done!';
        }

        const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return `${days}d ${hours}h`;
    }
}
