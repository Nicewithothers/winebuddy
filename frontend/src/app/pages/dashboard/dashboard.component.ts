import { Component, OnInit } from '@angular/core';
import {
    HlmCardContentDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { AuthService } from '../../shared/services/auth.service';
import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import {
    latLng,
    MapOptions,
    tileLayer,
    FeatureGroup,
    Control,
    Layer,
    LayerEvent,
    Map,
    GeoJSON,
    Draw,
    geoJSON,
} from 'leaflet';
import 'leaflet-draw';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { vineyardForm } from '../../shared/forms/vineyard.form';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VineyardService } from '../../shared/services/vineyard.service';
import { toast } from 'ngx-sonner';
import { HlmFormFieldComponent } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmTableImports } from '@spartan-ng/ui-table-helm';
import { User } from '../../shared/models/User';
import { DateTransformPipe } from '../../shared/pipes/datetransform.pipe';
import { firstValueFrom } from 'rxjs';
import { BrnContextMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuComponent, HlmMenuItemImports } from '@spartan-ng/ui-menu-helm';

@Component({
    selector: 'app-dashboard',
    imports: [
        HlmCardContentDirective,
        HlmCardDirective,
        HlmCardHeaderDirective,
        HlmCardTitleDirective,
        AsyncPipe,
        LeafletModule,
        LeafletDrawModule,
        ReactiveFormsModule,
        HlmFormFieldComponent,
        HlmInputDirective,
        HlmButtonDirective,
        HlmTableImports,
        DateTransformPipe,
        NgIf,
        DecimalPipe,
        BrnContextMenuImports,
        HlmMenuComponent,
        NgIcon,
    ],
    providers: [provideIcons({ lucidePlus, lucideMenu, lucideTrash2 })],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: true,
})
export class DashboardComponent implements OnInit {
    user!: User;
    userInitialized: boolean = false;
    map!: Map;
    drawnLayer: Layer | null = null;
    drawnItems: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                minZoom: 7,
            }),
        ],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };

    drawVineyardOptions: Control.DrawConstructorOptions = {
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
            featureGroup: this.drawnItems,
        },
    };

    vineyardForm: FormGroup = vineyardForm();

    constructor(
        protected authService: AuthService,
        private vineyardService: VineyardService,
    ) {}

    async ngOnInit() {
        this.user = await firstValueFrom(this.authService.user$);
        this.userInitialized = true;

        if (this.map) {
            this.initMapFeatures();
        }
    }

    onMapReady(map: Map) {
        this.map = map;
        this.drawnItems.addTo(map);

        if (this.userInitialized) {
            this.initMapFeatures();
        }
    }

    initMapFeatures() {
        if (this.user.vineyard === null || this.user.vineyard === undefined) {
            this.map.on(Draw.Event.CREATED, (event: LayerEvent) => {
                const layer = event.layer as GeoJSON;
                this.drawnLayer = layer;
                this.drawnItems.clearLayers();
                this.drawnItems.addLayer(layer);
            });
        } else {
            const layer = geoJSON(this.user.vineyard?.mapArea);
            layer.addTo(this.map);
            this.map.setMaxBounds(layer.getBounds());
            this.map.fitBounds(layer.getBounds());
        }
    }

    checkFields(): boolean {
        return this.vineyardForm.get('name')?.invalid || this.drawnLayer === null;
    }

    addVineyard(): void {
        const name = this.vineyardForm.get('name')?.value as string;
        const polygonGeo = this.drawnItems.toGeoJSON();
        this.vineyardService
            .createVineyard({ name: name, createdPolygon: polygonGeo })
            .subscribe(user => {
                if (user) {
                    toast.success('Vineyard created successfully.', {
                        position: 'bottom-center',
                    });
                } else {
                    toast.error('Vineyard creation failed', {
                        position: 'bottom-center',
                    });
                }
            });
    }

    deleteVineyard() {
        this.vineyardService.deleteVineyard(this.user.vineyard?.id as number).subscribe(user => {
            if (user) {
                toast.success('Vineyard deleted successfully.', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Vineyard deleted failed', {
                    position: 'bottom-center',
                });
            }
        });
    }
}
