import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { AuthService } from '../../../shared/services/auth.service';
import { barrelForm } from '../../../shared/forms/barrel.form';
import { lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { Cellar } from '../../../shared/models/Cellar';
import { DateTransformPipe } from '../../../shared/pipes/datetransform.pipe';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { barrelTypes } from '../../../shared/models/enums/barrel/BarrelType';
import { barrelSizes } from '../../../shared/models/enums/barrel/BarrelSize';
import { BarrelRequest } from '../../../shared/models/requests/BarrelRequest';
import { BarrelService } from '../../../shared/services/barrel.service';
import { toast } from 'ngx-sonner';
import { HlmTableImports } from '@spartan-ng/helm/table';

@Component({
    selector: 'app-barrel-dashboard',
    imports: [
        AsyncPipe,
        NgIcon,
        LeafletModule,
        LeafletDrawModule,
        ReactiveFormsModule,
        BrnDialogImports,
        HlmTabsImports,
        HlmSelectImports,
        BrnSelectImports,
        BrnMenuImports,
        HlmMenuImports,
        HlmButtonImports,
        HlmTypographyImports,
        HlmDialogImports,
        HlmFormFieldImports,
        HlmTableImports,
    ],
    providers: [provideIcons({ lucideTrash2, lucidePlus })],
    templateUrl: './barrel-dashboard.component.html',
    styleUrl: './barrel-dashboard.component.css',
})
export class BarrelDashboardComponent implements OnInit {
    user!: User;
    map!: Map;
    cellarLayers: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };
    barrelForm: FormGroup = barrelForm();
    selectedCellar: Cellar | null = null;
    datePipe: DateTransformPipe = new DateTransformPipe();
    numberPipe: DecimalPipe = new DecimalPipe('en-US');
    barrelTypes = barrelTypes;
    barrelSizes = barrelSizes;

    constructor(
        protected authService: AuthService,
        private barrelService: BarrelService,
    ) {}

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.user = user;
            if (this.map) {
                this.initMap();
            }
        });
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

    addBarrel(id: number): void {
        const barrelType = this.barrelForm.get('barrelType')?.value;
        const barrelSize = this.barrelForm.get('barrelSize')?.value;
        const barrelRequest: BarrelRequest = {
            cellarId: id,
            barrelType: barrelType,
            barrelSize: barrelSize,
        };
        this.barrelService.createBarrel(barrelRequest).subscribe(user => {
            if (user) {
                this.updateCurrentCellar(this.selectedCellar);
                toast.success('Barrel creation successful!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
            } else {
                toast.error('Barrel creation failed!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
            }
        });
    }

    updateCurrentCellar(currentCellar: Cellar | null): void {
        if (currentCellar) {
            this.user!.vineyard!.cellars!.forEach(cellar => {
                if (cellar.id === currentCellar.id) {
                    this.selectedCellar = cellar;
                }
                return;
            });
        }
        return;
    }

    deleteBarrel(id: number): void {}
}
