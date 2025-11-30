import { Component, Input } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { DateTransformPipe } from '../../pipes/datetransform.pipe';
import { HlmCaption, HlmTableImports } from '@spartan-ng/helm/table';
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
import { lucideCheck, lucideGrape, lucideX } from '@ng-icons/lucide';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { grapevineForm } from '../../forms/grapevine/grapevine.form';
import { HlmFormField } from '@spartan-ng/helm/form-field';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { grapeTypes } from '../../models/enums/grape/GrapeType';
import { GrapevineService } from '../../services/grapevine.service';
import { toast } from 'ngx-sonner';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { grapevineHarvestForm } from '../../forms/grapevine/grapevine-harvest.form';
import { GrapevineHarvestRequest } from '../../models/requests/grapevine/GrapevineHarvestRequest';

@Component({
    selector: 'app-cellarcard',
    imports: [
        HlmCaption,
        HlmTableImports,
        AsyncPipe,
        HlmButtonImports,
        NgIcon,
        HlmIcon,
        BrnDialogImports,
        HlmDialogImports,
        ReactiveFormsModule,
        HlmFormField,
        BrnSelectImports,
        HlmSelectImports,
        DecimalPipe,
        DateTransformPipe,
        HlmAlertDialogImports,
        BrnAlertDialogContent,
        BrnAlertDialogTrigger,
        DatePipe,
    ],
    providers: [provideIcons({ lucideGrape, lucideX, lucideCheck })],
    templateUrl: './customcard.component.html',
    styleUrl: './customcard.component.css',
})
export class CustomcardComponent {
    @Input() inputVineyard!: Vineyard | null;
    @Input() inputCellar!: Cellar | null;
    @Input() inputGrapevine!: Grapevine | null;

    grapevineForm: FormGroup = grapevineForm();
    grapevineHarvestForm: FormGroup = grapevineHarvestForm();
    selectedCellarForHarvest: Cellar | null = null;
    protected readonly grapeTypes = grapeTypes;

    constructor(
        protected router: Router,
        protected authService: AuthService,
        private grapevineService: GrapevineService,
    ) {}

    urlCleaner(url: string): string {
        return url.slice(1, url.length).split('-')[0];
    }

    addGrapeToGrapevine(id: number): void {
        const grapeType = this.grapevineForm.get('grapeType')?.value;
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

    deleteGrapevine(id: number): void {
        this.grapevineService.deleteGrapevine(id).subscribe(user => {
            if (user) {
                toast.success('Grape removed successfully!', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Grape removal failed!', {
                    position: 'bottom-center',
                });
            }
        });
    }

    harvestGrapevine(id: number, grapeType: string): void {
        const harvestGrapevineRequest: GrapevineHarvestRequest = {
            grapeType: grapeType,
            cellarId: this.selectedCellarForHarvest!.id,
        };
        console.log(harvestGrapevineRequest);
        this.grapevineService.harvestGrapevine(id, harvestGrapevineRequest).subscribe(user => {
            if (user) {
                toast.success('Grapevine harvested successfully!', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Grapevine harvest failed!', {
                    position: 'bottom-center',
                });
            }
        });
    }

    checkGrapevineFields(): boolean {
        return !this.grapevineForm.valid;
    }

    checkGrapevineHarvestFields(): boolean {
        return !this.grapevineHarvestForm.valid && this.selectedCellarForHarvest === null;
    }

    handleCurrentCellar(newCellar: Cellar): void {
        this.selectedCellarForHarvest = newCellar;
        console.log(this.selectedCellarForHarvest);
    }
}
