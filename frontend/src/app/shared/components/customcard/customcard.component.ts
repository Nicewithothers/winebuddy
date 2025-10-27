import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
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
import { Vineyard } from '../../models/Vineyard';
import { Grapevine } from '../../models/Grapevine';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { lucideGrape } from '@ng-icons/lucide';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { grapevineForm } from '../../forms/grapevine.form';
import { HlmFormField } from '@spartan-ng/helm/form-field';
import { BrnSelect, BrnSelectContent, BrnSelectValue } from '@spartan-ng/brain/select';
import {
    HlmSelectContent,
    HlmSelectLabel,
    HlmSelectOption,
    HlmSelectTrigger,
    HlmSelectValue,
} from '@spartan-ng/helm/select';
import { grapeTypes } from '../../models/enums/grape/GrapeType';
import { User } from '../../models/User';
import { GrapevineRequest } from '../../models/requests/GrapevineRequest';
import { GrapevineService } from '../../services/grapevine.service';
import { toast } from 'ngx-sonner';

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
        HlmButtonImports,
        NgIcon,
        HlmIcon,
        BrnDialogImports,
        HlmDialogImports,
        ReactiveFormsModule,
        HlmFormField,
        BrnSelect,
        BrnSelectContent,
        BrnSelectValue,
        HlmSelectContent,
        HlmSelectLabel,
        HlmSelectOption,
        HlmSelectTrigger,
        HlmSelectValue,
    ],
    providers: [provideIcons({ lucideGrape })],
    templateUrl: './customcard.component.html',
    styleUrl: './customcard.component.css',
})
export class CustomcardComponent implements OnInit {
    user!: User;
    @Input() inputVineyard!: Vineyard | null;
    @Input() inputCellar!: Cellar | null;
    @Input() inputGrapevine!: Grapevine | null;

    grapevineForm: FormGroup = grapevineForm();
    protected readonly grapeTypes = grapeTypes;

    constructor(
        private vcr: ViewContainerRef,
        protected router: Router,
        protected authService: AuthService,
        private grapevineService: GrapevineService,
    ) {}

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
    }

    urlCleaner(url: string): string {
        return url.slice(1, url.length).split('-')[0];
    }

    addGrapeToGrapevine(id: number): void {
        const grapeType = this.grapevineForm.get('grapeType')?.value;
        console.log(grapeType);
        this.grapevineService.setGrapetoGrapeVine(id, grapeType).subscribe(user => {
            if (user) {
                toast.success('Grape set to grapevine successfully!', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Updating grapevine failed!', {
                    position: 'bottom-center',
                });
            }
        });
    }

    checkFields(): boolean {
        return !this.grapevineForm.valid;
    }
}
