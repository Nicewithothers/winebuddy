import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { HlmTabsImports } from '@spartan-ng/ui-tabs-helm';
import { BrnContextMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuComponent } from '@spartan-ng/ui-menu-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { HlmDialogImports } from '@spartan-ng/ui-dialog-helm';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HlmFormFieldComponent } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { User } from '../../../shared/models/User';
import {
    Content,
    FeatureGroup,
    GeoJSON,
    geoJSON,
    latLng,
    LayerEvent,
    Map,
    MapOptions,
    tileLayer,
} from 'leaflet';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { barrelForm } from '../../../shared/forms/barrel.form';
import { lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { HlmH2Directive } from '@spartan-ng/ui-typography-helm';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { Cellar } from '../../../shared/models/Cellar';
import { BarrelTypeTransform } from '../../../shared/models/enums/BarrelType';
import { BarrelSizeTransform } from '../../../shared/models/enums/BarrelSize';
import { DateTransformPipe } from '../../../shared/pipes/datetransform.pipe';

@Component({
    selector: 'app-barrel-dashboard',
    imports: [
        AsyncPipe,
        HlmTabsImports,
        BrnContextMenuImports,
        HlmMenuComponent,
        NgIcon,
        HlmButtonDirective,
        LeafletModule,
        LeafletDrawModule,
        HlmDialogImports,
        ReactiveFormsModule,
        HlmFormFieldComponent,
        HlmInputDirective,
        HlmSpinnerComponent,
        HlmH2Directive,
        BrnDialogImports,
        BrnSelectImports,
        HlmSelectImports,
    ],
    providers: [provideIcons({ lucideTrash2, lucidePlus })],
    templateUrl: './barrel-dashboard.component.html',
    styleUrl: './barrel-dashboard.component.css',
})
export class BarrelDashboardComponent implements OnInit, OnDestroy {
    user!: User;
    map!: Map;
    cellarLayers: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };
    subscriptions: Subscription[] = [];
    barrelForm: FormGroup = barrelForm();
    selectedCellar: Cellar | null = null;
    barrelTypes = Object.values(BarrelTypeTransform);
    barrelSizes = Object.values(BarrelSizeTransform);
    datePipe: DateTransformPipe = new DateTransformPipe();
    numberPipe: DecimalPipe = new DecimalPipe('en-US');

    constructor(protected authService: AuthService) {}

    ngOnInit() {
        const userSub = this.authService.user$.pipe(filter(user => !!user)).subscribe(user => {
            this.user = user!;
            if (this.map) {
                this.initMap();
            }
        });
        this.subscriptions.push(userSub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    onMapReady(map: Map) {
        this.map = map;
        if (this.user) {
            this.initMap();
        }
    }

    initMap() {
        const vineyardLayer = geoJSON(this.user.vineyard?.mapArea);
        vineyardLayer
            .setStyle({
                color: '#008515',
            })
            .addTo(this.map);
        this.map.setMaxBounds(vineyardLayer.getBounds());
        this.map.fitBounds(vineyardLayer.getBounds());

        this.drawCellars();
        this.handleCellarEvent();
    }

    handleCellarEvent(): void {
        this.cellarLayers.on('click', (event: LayerEvent) => {
            const layer: GeoJSON = event.propagatedFrom;
            this.map.fitBounds(layer.getBounds());
        });
    }

    checkFields(): boolean {
        return <boolean>(
            (this.barrelForm.get('maxVolume')?.invalid ||
                this.barrelForm.get('barrelType')?.invalid ||
                this.barrelForm.get('barrelSize')?.invalid)
        );
    }

    drawCellars(): void {
        this.user.vineyard!.cellars!.forEach(cellar => {
            this.cellarLayers.addLayer(
                geoJSON(cellar.mapArea, {
                    onEachFeature: (_feature, layer) => {
                        const popup: Content = `
                            <ul>
                                <li>Name: ${cellar.name}</li>
                                <li>Area: ${this.numberPipe.transform(cellar.area)} km2</li>
                                <li>Capacity: ${cellar.capacity}</li>
                                <li>Owning date: ${this.datePipe.transform(cellar.owningDate)}</li>
                                <li>Barrels: ${cellar.barrels?.length ?? 0}</li>
                            </ul>
                            `;
                        layer.bindPopup(popup).addTo(this.map);
                        layer.on('click', () => {
                            layer.openPopup();
                        });
                    },
                }),
            );
        });

        this.cellarLayers
            .setStyle({
                color: '#5b2100',
            })
            .addTo(this.map);
    }

    handleCurrentBarrel(newCellar: Cellar): void {
        this.selectedCellar = newCellar;
    }

    addBarrel(): void {}

    deleteBarrel(): void {}
}
