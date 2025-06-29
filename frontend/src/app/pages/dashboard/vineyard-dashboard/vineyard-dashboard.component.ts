import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { DateTransformPipe } from '../../../shared/pipes/datetransform.pipe';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { User } from '../../../shared/models/User';
import {
    Control,
    Draw,
    FeatureGroup,
    geoJSON,
    GeoJSON,
    latLng,
    latLngBounds,
    LayerEvent,
    Map,
    MapOptions,
    tileLayer,
} from 'leaflet';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { VineyardService } from '../../../shared/services/vineyard.service';
import { filter, Subscription } from 'rxjs';
import { toast } from 'ngx-sonner';
import { BrnContextMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuComponent } from '@spartan-ng/ui-menu-helm';
import { HlmFormFieldComponent } from '@spartan-ng/ui-formfield-helm';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { vineyardForm } from '../../../shared/forms/vineyard.form';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmDialogImports } from '@spartan-ng/ui-dialog-helm';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { VineyardRequest } from '../../../shared/models/vineyard/VineyardRequest';

@Component({
    selector: 'app-vineyard-dashboard',
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
        LeafletModule,
        LeafletDrawModule,
        HlmInputDirective,
        BrnDialogImports,
        HlmDialogImports,
    ],
    standalone: true,
    providers: [provideIcons({ lucidePlus, lucideMenu, lucideTrash2 })],
    templateUrl: './vineyard-dashboard.component.html',
    styleUrl: './vineyard-dashboard.component.css',
})
export class VineyardDashboardComponent implements OnInit, OnDestroy {
    user!: User;
    map!: Map;
    vineyardLayer: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };
    subscriptions: Subscription[] = [];

    vineyardForm: FormGroup = vineyardForm();

    constructor(
        protected authService: AuthService,
        private vineyardService: VineyardService,
    ) {}

    ngOnInit() {
        const userSub = this.authService.user$.pipe(filter(user => !!user)).subscribe(user => {
            this.user = user!;
            console.log('Login: ', user);
            if (this.map) {
                this.setDrawFeatures();
                this.initMapFeatures();
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
            this.initMapFeatures();
        }
    }

    initMapFeatures() {
        if (!this.user.vineyard) {
            const hungaryBounds = latLngBounds([
                [45.7371, 16.1139],
                [48.5852, 22.8977],
            ]);
            this.map.fitBounds(hungaryBounds);
            this.map.setMaxBounds(hungaryBounds);
            this.map.setMinZoom(7);
            this.map.on(Draw.Event.CREATED, (event: LayerEvent) => {
                const layer = event.layer as GeoJSON;
                this.vineyardLayer.clearLayers();
                this.vineyardLayer.addLayer(layer);
            });
        } else {
            const layer = geoJSON(this.user.vineyard?.mapArea);
            layer.setStyle({ color: '#00490a' }).addTo(this.map);
            this.map.setMaxBounds(layer.getBounds());
            this.map.fitBounds(layer.getBounds());
        }
    }

    setDrawFeatures(): Control.DrawConstructorOptions {
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

    checkFields(): boolean {
        return (
            this.vineyardForm.get('name')?.invalid || this.vineyardLayer.getLayers().length === 0
        );
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
    }

    deleteVineyard() {
        this.vineyardService.deleteVineyard(this.user.vineyard?.id as number).subscribe(user => {
            if (user) {
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
}
