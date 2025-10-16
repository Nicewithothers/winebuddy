import { Component, Input, ViewContainerRef } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import {
    HlmCaption,
    HlmTable,
    HlmTBody,
    HlmTd,
    HlmTh,
    HlmTHead,
    HlmTr,
} from '@spartan-ng/helm/table';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Cellar } from '../../models/Cellar';
import { Grape } from '../../models/Grape';
import { Vineyard } from '../../models/Vineyard';

@Component({
    selector: 'app-cellarcard',
    imports: [
        DatePipe,
        DecimalPipe,
        HlmCaption,
        HlmTBody,
        HlmTHead,
        HlmTable,
        HlmTd,
        HlmTh,
        HlmTr,
        AsyncPipe,
    ],
    templateUrl: './customcard.component.html',
    styleUrl: './customcard.component.css',
})
export class CustomcardComponent {
    @Input() inputVineyard!: Vineyard | null;
    @Input() inputCellar!: Cellar | null;
    @Input() inputGrape!: Grape | null;

    constructor(
        private vcr: ViewContainerRef,
        protected router: Router,
        protected authService: AuthService,
    ) {}

    urlCleaner(url: string): string {
        return url.slice(1, url.length).split('-')[0];
    }
}
