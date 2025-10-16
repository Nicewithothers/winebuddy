import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucidePlus, lucideTrash2, lucideX } from '@ng-icons/lucide';
import { User } from '../../../shared/models/User';
import {
    Control,
    Draw,
    FeatureGroup,
    geoJSON,
    GeoJSON,
    latLng,
    latLngBounds,
    Layer,
    LayerEvent,
    Map,
    MapOptions,
    TileLayer,
    tileLayer,
} from 'leaflet';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { VineyardService } from '../../../shared/services/vineyard.service';
import { filter, Subscription } from 'rxjs';
import { toast } from 'ngx-sonner';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { vineyardForm } from '../../../shared/forms/vineyard.form';
import { VineyardRequest } from '../../../shared/models/requests/VineyardRequest';
import { DialogService } from '../../../shared/services/dialog.service';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { AsyncPipe } from '@angular/common';
import { CustomcardComponent } from '../../../shared/components/customcard/customcard.component';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
    selector: 'app-vineyard-dashboard',
    imports: [
        ReactiveFormsModule,
        LeafletModule,
        LeafletDrawModule,
        BrnDialogImports,
        HlmButtonImports,
        HlmDialogImports,
        HlmFormFieldImports,
        HlmInputImports,
        NgIcon,
        HlmIcon,
        HlmAlertDialogImports,
        BrnAlertDialogImports,
        AsyncPipe,
        BrnMenuImports,
        HlmMenuImports,
    ],
    standalone: true,
    providers: [provideIcons({ lucidePlus, lucideMenu, lucideTrash2, lucideX })],
    templateUrl: './vineyard-dashboard.component.html',
    styleUrl: './vineyard-dashboard.component.css',
})
export class VineyardDashboardComponent implements OnInit, OnDestroy {
    user!: User;
    map!: Map;
    control!: Control.Draw;
    vineyardLayer: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };
    subscriptions: Subscription[] = [];
    vineyardForm: FormGroup = vineyardForm();
    drawnLayerValidated: boolean = false;

    constructor(
        protected authService: AuthService,
        private vineyardService: VineyardService,
        protected dialogService: DialogService,
        private vcr: ViewContainerRef,
    ) {}

    ngOnInit() {
        const userSub = this.authService.user$.pipe(filter(user => !!user)).subscribe(user => {
            this.user = user!;
            if (this.map) {
                this.initMap();
                this.updateDrawControl();
            }
        });
        this.subscriptions.push(userSub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    onMapReady(map: Map) {
        this.map = map;
        this.vineyardLayer.addTo(map);

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
        this.map.setMinZoom(7);
        if (!this.user.vineyard) {
            const hungaryBounds = latLngBounds([
                [45.7371, 16.1139],
                [48.5852, 22.8977],
            ]);
            this.map.fitBounds(hungaryBounds);
            this.map.setMaxBounds(hungaryBounds);
            this.map.on(Draw.Event.CREATED, (event: LayerEvent) => {
                const layer = event.layer as GeoJSON;
                this.vineyardLayer.clearLayers();
                this.vineyardLayer.addLayer(layer);
                this.validateVineyardLayer(this.vineyardLayer.toGeoJSON());
            });
        } else {
            const layer = geoJSON(this.user.vineyard!.mapArea, {
                onEachFeature: (_feature, layer) => {
                    const card = this.vcr.createComponent(CustomcardComponent);
                    card.setInput('inputVineyard', this.user.vineyard!);
                    card.changeDetectorRef.detectChanges();
                    let popupalt = document.createElement('div');
                    popupalt.appendChild(card.location.nativeElement);
                    layer.bindPopup(popupalt, { closeButton: false }).addTo(this.map);
                    layer.on('click', event => layer.openPopup(event.latlng));
                },
            });
            layer.setStyle({ color: '#00490a' }).addTo(this.map);
            this.map.setMaxBounds(layer.getBounds());
            this.map.fitBounds(layer.getBounds());
        }
    }

    getDrawFeatures(): Control.DrawConstructorOptions {
        return {
            position: 'bottomleft',
            draw: !this.user.vineyard
                ? {
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
                  }
                : undefined,
            edit: {
                featureGroup: this.vineyardLayer,
            },
        };
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

    checkFields(): boolean {
        return (
            this.vineyardForm.get('name')?.invalid ||
            this.vineyardLayer.getLayers().length === 0 ||
            !this.drawnLayerValidated
        );
    }

    validateVineyardLayer(layer: any): void {
        this.vineyardService.validateVineyard(layer).subscribe(response => {
            if (response) {
                this.drawnLayerValidated = true;
                this.vineyardLayer.setStyle({ color: '#00ff00' });
                toast.success('Drawn polygon validation successful!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
                this.triggerDialog();
            } else {
                this.drawnLayerValidated = false;
                this.vineyardLayer.setStyle({ color: '#ff0000' });
                toast.error('Drawn polygon is invalid!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
                setTimeout(() => {
                    this.vineyardLayer.clearLayers();
                }, 2000);
            }
        });
    }

    addVineyard(): void {
        const name = this.vineyardForm.get('name')?.value as string;
        const polygonGeo = this.vineyardLayer.toGeoJSON();
        const vineyardRequest: VineyardRequest = { name: name, createdPolygon: polygonGeo };
        this.vineyardService.createVineyard(vineyardRequest).subscribe(user => {
            if (user) {
                toast.success('Vineyard created successfully!', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Vineyard creation failed!', {
                    position: 'bottom-center',
                });
            }
        });
        this.dialogService.setClosedState();
    }

    deleteLayers(): void {
        this.map.eachLayer((layer: Layer) => {
            if (!(layer instanceof TileLayer)) {
                layer.remove();
            }
        });
    }

    deleteVineyard() {
        this.vineyardService.deleteVineyard(this.user.vineyard!.id as number).subscribe(user => {
            if (user) {
                this.deleteLayers();
                toast.success('Vineyard deleted successfully!', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Vineyard deletion failed!', {
                    position: 'bottom-center',
                });
            }
        });
    }

    triggerDialog(): void {
        this.dialogService.setOpenState();
    }

    closeDialog(): void {
        this.vineyardLayer.clearLayers();
        this.dialogService.setClosedState();
    }
}
