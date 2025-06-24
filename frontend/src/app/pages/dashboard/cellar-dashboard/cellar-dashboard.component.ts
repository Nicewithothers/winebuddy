import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { filter, Subscription } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { toast } from 'ngx-sonner';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { DateTransformPipe } from '../../../shared/pipes/datetransform.pipe';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardContentDirective, HlmCardImports } from '@spartan-ng/ui-card-helm';
import { HlmTableImports } from '@spartan-ng/ui-table-helm';
import { BrnContextMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuComponent } from '@spartan-ng/ui-menu-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmFormFieldComponent } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import {
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { cellarForm } from '../../../shared/forms/cellar.form';
import { CellarService } from '../../../shared/services/cellar.service';
import { CellarRequest } from '../../../shared/models/cellar/CellarRequest';
import { lucideTrash2 } from '@ng-icons/lucide';

@Component({
    selector: 'app-cellar-dashboard',
    imports: [
        AsyncPipe,
        DateTransformPipe,
        DecimalPipe,
        HlmButtonDirective,
        HlmCardContentDirective,
        HlmCardImports,
        HlmTableImports,
        BrnContextMenuImports,
        HlmMenuComponent,
        NgIcon,
        ReactiveFormsModule,
        HlmFormFieldComponent,
        HlmInputDirective,
        LeafletModule,
        LeafletDrawModule,
        BrnDialogContentDirective,
        BrnDialogTriggerDirective,
        HlmDialogComponent,
        HlmDialogContentComponent,
        HlmDialogDescriptionDirective,
        HlmDialogHeaderComponent,
        HlmDialogTitleDirective,
    ],
    providers: [provideIcons({ lucideTrash2 })],
    templateUrl: './cellar-dashboard.component.html',
    styleUrl: './cellar-dashboard.component.css',
})
export class CellarDashboardComponent implements OnInit, OnDestroy {
    user!: User;
    map!: Map;
    drawnLayer: Layer | null = null;
    cellarLayers: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };
    subscriptions: Subscription[] = [];
    cellarForm: FormGroup = cellarForm();

    constructor(
        protected authService: AuthService,
        private cellarService: CellarService,
    ) {}

    ngOnInit() {
        const userSub = this.authService.user$.pipe(filter(user => !!user)).subscribe(user => {
            this.user = user!;
            if (this.map) {
                this.setDrawFeatures();
                this.initVineyardMap();
            }
        });
        this.subscriptions.push(userSub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    onMapReady(map: Map) {
        this.map = map;
        this.cellarLayers.addTo(map);

        if (this.user) {
            this.initVineyardMap();
        }
    }

    initVineyardMap() {
        const layer = geoJSON(this.user.vineyard?.mapArea);
        layer
            .setStyle({
                color: '#008515',
            })
            .addTo(this.map);
        this.map.setMaxBounds(layer.getBounds());
        this.map.fitBounds(layer.getBounds());

        this.map.on(Draw.Event.CREATED, (event: LayerEvent) => {
            const layer = event.layer as GeoJSON;
            this.drawnLayer = layer;
            console.log(layer.toGeoJSON());
            this.cellarLayers.clearLayers();
            this.cellarLayers.addLayer(layer);
        });

        const layers: FeatureGroup = new FeatureGroup();
        this.user.vineyard!.cellars!.forEach(cell => {
            layers.addLayer(geoJSON(cell.mapArea));
        });
        layers
            .setStyle({
                color: '#5b2100',
            })
            .addTo(this.map);
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
                featureGroup: this.cellarLayers,
            },
        };
    }

    checkFields(): boolean {
        return (
            this.cellarForm.get('name')?.invalid ||
            this.cellarForm.get('capacity')?.invalid ||
            this.drawnLayer === null
        );
    }

    addCellar() {
        const cellarRequest: CellarRequest = {
            name: this.cellarForm.get('name')?.value,
            capacity: this.cellarForm.get('capacity')?.value,
            createdPolygon: this.cellarLayers.toGeoJSON(),
        };
        this.cellarService.createCellar(cellarRequest).subscribe(user => {
            if (user) {
                this.user = user;
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
    }

    deleteCellar(id: number) {}
}
