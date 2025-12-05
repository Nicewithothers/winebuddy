import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { User } from '../../../shared/models/User';
import {
    Control,
    Draw,
    FeatureGroup,
    geoJSON,
    GeoJSON,
    latLng,
    Layer,
    LayerEvent,
    Map,
    MapOptions,
    tileLayer,
} from 'leaflet';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { toast } from 'ngx-sonner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { cellarForm } from '../../../shared/forms/cellar.form';
import { CellarService } from '../../../shared/services/cellar.service';
import { CellarRequest } from '../../../shared/models/requests/CellarRequest';
import { lucideMenu, lucidePlus, lucideTrash2, lucideX } from '@ng-icons/lucide';
import { DialogService } from '../../../shared/services/dialog.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { CustomcardComponent } from '../../../shared/components/customcard/customcard.component';
import { AsyncPipe } from '@angular/common';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { Cellar } from '../../../shared/models/Cellar';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-cellar-dashboard',
    imports: [
        ReactiveFormsModule,
        LeafletModule,
        LeafletDrawModule,
        HlmButtonImports,
        HlmDialogImports,
        HlmFormFieldImports,
        HlmInputImports,
        BrnDialogImports,
        AsyncPipe,
        HlmAlertDialogImports,
        HlmIcon,
        HlmMenuImports,
        NgIcon,
        BrnMenuImports,
        BrnSelectImports,
        HlmSelectImports,
        BrnAlertDialogImports,
    ],
    providers: [provideIcons({ lucideTrash2, lucidePlus, lucideMenu, lucideX })],
    templateUrl: './cellar-dashboard.component.html',
    styleUrl: './cellar-dashboard.component.css',
})
export class CellarDashboardComponent implements OnInit {
    user!: User;
    map!: Map;
    control!: Control.Draw;
    vineyardLayer: FeatureGroup = new FeatureGroup();
    drawnLayer: FeatureGroup = new FeatureGroup();
    drawnLayerValidated: boolean = false;
    cellarLayers: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };
    cellarForm: FormGroup = cellarForm();
    currentCellar: Cellar | null = null;

    constructor(
        protected authService: AuthService,
        private cellarService: CellarService,
        protected dialogService: DialogService,
        private vcr: ViewContainerRef,
    ) {}

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.user = user;
            if (this.map) {
                this.initMap();
                this.updateDrawControl();
            }
        });
    }

    onMapReady(map: Map) {
        this.map = map;
        this.drawnLayer.addTo(map);

        if (this.user) {
            this.initMap();
        }
    }

    onDrawReady(drawControl: Control.Draw) {
        this.control = drawControl;
        if (this.map) {
            this.updateDrawControl();
        }
    }

    initMap() {
        if (this.vineyardLayer) {
            this.map.removeLayer(this.vineyardLayer);
        }

        this.vineyardLayer = geoJSON(this.user.vineyard!.mapArea);
        this.vineyardLayer
            .setStyle({
                color: '#008515',
            })
            .addTo(this.map);
        this.map.setMaxBounds(this.vineyardLayer.getBounds());
        this.map.fitBounds(this.vineyardLayer.getBounds());

        this.map.on(Draw.Event.CREATED, (event: LayerEvent) => {
            const layer = event.layer as GeoJSON;
            this.drawnLayer.clearLayers();
            this.drawnLayer.addLayer(layer);
            this.validateCellarLayer(this.drawnLayer.toGeoJSON());
        });

        this.drawCellars();
        this.handleCellarEvent();
    }

    getDrawFeatures(): Control.DrawConstructorOptions {
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

    handleCurrentCellar(newCellar: Cellar): void {
        this.currentCellar = newCellar;
    }

    drawCellars(): void {
        this.cellarLayers.clearLayers();

        this.user.vineyard!.cellars!.forEach(cellar => {
            this.cellarLayers.addLayer(
                geoJSON(cellar.mapArea, {
                    onEachFeature: (_feature, layer) => {
                        const card = this.vcr.createComponent(CustomcardComponent);
                        card.setInput('inputCellar', cellar);
                        card.changeDetectorRef.detectChanges();
                        let popupalt = document.createElement('div');
                        popupalt.appendChild(card.location.nativeElement);
                        layer.bindPopup(popupalt).addTo(this.map);
                        layer.on('click', event => layer.openPopup(event.latlng));
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

    updateDrawControl(): void {
        if (!this.control || !this.map) {
            return;
        }

        this.map.removeControl(this.control);

        const options = this.getDrawFeatures();
        this.control = new Control.Draw(options);
        this.map.addControl(this.control);
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
                this.drawnLayerValidated = false;
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

    deleteCellar(id: number): void {
        this.cellarService.deleteCellar(id).subscribe(user => {
            if (user) {
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
