import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/models/User';
import {
    Content,
    Control,
    Draw,
    FeatureGroup,
    geoJSON,
    GeoJSON,
    latLng,
    LayerEvent,
    Map,
    MapOptions,
    tileLayer,
} from 'leaflet';
import { filter, Subscription } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { toast } from 'ngx-sonner';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { DateTransformPipe } from '../../../shared/pipes/datetransform.pipe';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnContextMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuComponent } from '@spartan-ng/ui-menu-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmFormFieldComponent } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import {
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { cellarForm } from '../../../shared/forms/cellar.form';
import { CellarService } from '../../../shared/services/cellar.service';
import { CellarRequest } from '../../../shared/models/requests/CellarRequest';
import { lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmTabsImports } from '@spartan-ng/ui-tabs-helm';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
    selector: 'app-cellar-dashboard',
    imports: [
        AsyncPipe,
        DateTransformPipe,
        DecimalPipe,
        HlmButtonDirective,
        BrnContextMenuImports,
        HlmMenuComponent,
        NgIcon,
        ReactiveFormsModule,
        HlmFormFieldComponent,
        HlmInputDirective,
        LeafletModule,
        LeafletDrawModule,
        BrnDialogContentDirective,
        HlmDialogComponent,
        HlmDialogContentComponent,
        HlmDialogDescriptionDirective,
        HlmDialogHeaderComponent,
        HlmDialogTitleDirective,
        HlmSpinnerComponent,
        HlmTabsImports,
    ],
    providers: [provideIcons({ lucideTrash2, lucidePlus })],
    templateUrl: './cellar-dashboard.component.html',
    styleUrl: './cellar-dashboard.component.css',
})
export class CellarDashboardComponent implements OnInit, OnDestroy {
    user!: User;
    map!: Map;
    drawnLayer: FeatureGroup = new FeatureGroup();
    drawnLayerValidated: boolean = false;
    cellarLayers: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };
    subscriptions: Subscription[] = [];
    cellarForm: FormGroup = cellarForm();
    datePipe: DateTransformPipe = new DateTransformPipe();
    numberPipe: DecimalPipe = new DecimalPipe('en-US');

    constructor(
        protected authService: AuthService,
        private cellarService: CellarService,
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
        this.drawnLayer.addTo(map);

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

        this.map.on(Draw.Event.CREATED, (event: LayerEvent) => {
            const layer = event.layer as GeoJSON;
            this.drawnLayer.clearLayers();
            this.drawnLayer.addLayer(layer);
            this.validateCellarLayer(this.drawnLayer.toGeoJSON());
        });

        this.drawCellars();
        this.handleCellarEvent();
    }

    setDrawFeatures(): Control.DrawConstructorOptions {
        return {
            position: 'bottomleft',
            draw: {
                polygon: {
                    allowIntersection: false,
                    shapeOptions: {
                        color: '#000',
                        fillColor: '#000',
                    },
                },
                marker: false,
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
            },
            edit: {
                featureGroup: this.drawnLayer,
            },
        };
    }

    checkFields(): boolean {
        return (
            this.cellarForm.get('name')?.invalid ||
            this.cellarForm.get('capacity')?.invalid ||
            this.drawnLayer.getLayers().length === 0 ||
            !this.drawnLayerValidated
        );
    }

    validateCellarLayer(layer: any): void {
        this.cellarService.validateCellar(layer).subscribe(response => {
            if (response) {
                this.drawnLayerValidated = true;
                this.drawnLayer.setStyle({ color: '#00ff00' });
                toast.success('Drawn polygon validation successful!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
                this.triggerDialog();
            } else {
                this.drawnLayerValidated = false;
                this.drawnLayer.setStyle({ color: '#ff0000' });
                toast.error('Drawn polygon is invalid!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
                setTimeout(() => {
                    this.drawnLayer.clearLayers();
                }, 2000);
            }
        });
    }

    handleCellarEvent(): void {
        this.cellarLayers.on('click', (event: LayerEvent) => {
            const layer: GeoJSON = event.propagatedFrom;
            this.map.fitBounds(layer.getBounds());
        });
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

    addCellar(): void {
        const cellarRequest: CellarRequest = {
            name: this.cellarForm.get('name')?.value,
            capacity: this.cellarForm.get('capacity')?.value,
            createdPolygon: this.drawnLayer.toGeoJSON(),
        };
        this.cellarService.createCellar(cellarRequest).subscribe(user => {
            if (user) {
                toast.success('Cellar created successfully!', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Cellar creation failed!', {
                    position: 'bottom-center',
                });
                throw new Error();
            }
        });
        this.dialogService.setClosedState();
        this.cellarForm.reset();
    }

    deleteCellarLayer(): void {
        this.cellarLayers.clearLayers();
        this.drawCellars();
    }

    deleteCellar(id: number): void {
        this.cellarService.deleteCellar(id).subscribe(user => {
            if (user) {
                this.deleteCellarLayer();
                toast.success('Cellar deleted successfully!', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Cellar deletion failed!', {
                    position: 'bottom-center',
                });
                throw new Error();
            }
        });
    }

    triggerDialog(): void {
        this.dialogService.setOpenState();
    }

    closeDialog(): void {
        this.drawnLayer.clearLayers();
        this.dialogService.setClosedState();
    }
}
