import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { HlmTabsImports } from '@spartan-ng/ui-tabs-helm';
import { BrnContextMenuImports } from '@spartan-ng/brain/menu';
import { DateTransformPipe } from '../../../shared/pipes/datetransform.pipe';
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
    Control,
    Draw,
    FeatureGroup,
    GeoJSON,
    geoJSON,
    latLng,
    LayerEvent,
    Map,
    MapOptions,
    tileLayer,
    Icon,
} from 'leaflet';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { barrelForm } from '../../../shared/forms/barrel.form';
import { lucideTrash2 } from '@ng-icons/lucide';
import { HlmH2Directive, HlmH3Directive } from '@spartan-ng/ui-typography-helm';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { Cellar } from '../../../shared/models/Cellar';
import { Barrel } from '../../../shared/models/Barrel';

@Component({
    selector: 'app-barrel-dashboard',
    imports: [
        AsyncPipe,
        HlmTabsImports,
        BrnContextMenuImports,
        DecimalPipe,
        DateTransformPipe,
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
        HlmH3Directive,
    ],
    providers: [provideIcons({ lucideTrash2 })],
    templateUrl: './barrel-dashboard.component.html',
    styleUrl: './barrel-dashboard.component.css',
})
export class BarrelDashboardComponent implements OnInit, OnDestroy {
    user!: User;
    map!: Map;
    customIcon: Icon = new Icon({ iconUrl: 'images/mini_barrel.png' });
    drawnPoint: FeatureGroup = new FeatureGroup();
    drawnPointValidated: boolean = false;
    cellarLayers: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };
    subscriptions: Subscription[] = [];
    barrelForm: FormGroup = barrelForm();
    selectedCellar: Cellar | null = null;

    constructor(
        protected authService: AuthService,
        protected dialogService: DialogService,
    ) {}

    ngOnInit() {
        const userSub = this.authService.user$.pipe(filter(user => !!user)).subscribe(user => {
            this.user = user!;
            if (this.map) {
                this.setDrawFeatures();
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
        this.drawnPoint.addTo(map);

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

        this.map.on(Draw.Event.CREATED, (event: LayerEvent) => {
            const layer = event.layer as GeoJSON;
            console.log(layer.toGeoJSON());
            this.validateBarrelLayer(this.drawnPoint.toGeoJSON());
        });
    }

    setDrawFeatures(): Control.DrawConstructorOptions {
        return {
            position: 'bottomleft',
            draw: {
                marker: {
                    icon: this.customIcon,
                    repeatMode: false,
                },
                polygon: false,
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
            },
            edit: {
                featureGroup: this.drawnPoint,
            },
        };
    }

    checkFields(): boolean {
        return (
            this.barrelForm.get('maxVolume')?.invalid ||
            this.drawnPoint.getLayers().length === 0 ||
            !this.drawnPointValidated
        );
    }

    drawCellars(): void {
        this.user.vineyard!.cellars!.forEach(cellar => {
            this.cellarLayers.addLayer(
                geoJSON(cellar.mapArea, {
                    onEachFeature: (_feature, layer) => {
                        const popup: Content = `
                            <ul>
                                <li>${cellar.name}</li>
                                <li>${cellar.capacity}</li>
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
    }

    handleCurrentBarrel(newCellar: Cellar): void {
        this.selectedCellar = newCellar;
    }

    validateBarrelLayer(layer: any) {}

    addBarrel(): void {}

    deleteBarrel(id: number): void {}
}
