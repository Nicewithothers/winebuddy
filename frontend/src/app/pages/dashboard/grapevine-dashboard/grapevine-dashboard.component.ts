import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { User } from '../../../shared/models/User';
import {
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
} from 'leaflet';
import { AuthService } from '../../../shared/services/auth.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { toast } from 'ngx-sonner';
import { CustomcardComponent } from '../../../shared/components/customcard/customcard.component';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { GrapevineService } from '../../../shared/services/grapevine.service';
import { lucideGrape, lucideMenu, lucideX } from '@ng-icons/lucide';
import { CustomtooltipComponent } from '../../../shared/components/customtooltip/customtooltip.component';

@Component({
    selector: 'app-grapevine-dashboard',
    imports: [
        AsyncPipe,
        BrnDialogImports,
        FormsModule,
        HlmButtonImports,
        HlmMenuImports,
        HlmIconImports,
        LeafletDrawModule,
        LeafletModule,
        NgIcon,
        ReactiveFormsModule,
        BrnMenuImports,
        HlmDialogImports,
    ],
    providers: [provideIcons({ lucideGrape, lucideMenu, lucideX })],
    templateUrl: './grapevine-dashboard.component.html',
    styleUrl: './grapevine-dashboard.component.css',
})
export class GrapevineDashboardComponent implements OnInit {
    user!: User;
    map!: Map;
    control!: Control.Draw;
    drawnGrapevine: FeatureGroup = new FeatureGroup();
    drawnGrapevineValidated: boolean = false;
    cellarLayers: FeatureGroup = new FeatureGroup();
    grapevineLayers: FeatureGroup = new FeatureGroup();
    options: MapOptions = {
        layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
        zoom: 7,
        center: latLng([47.1625, 19.5033]),
    };

    constructor(
        protected authService: AuthService,
        private grapevineService: GrapevineService,
        protected dialogService: DialogService,
        private vcr: ViewContainerRef,
    ) {}

    ngOnInit(): void {
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
        this.drawnGrapevine.addTo(map);

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
        const vineyardLayer = geoJSON(this.user.vineyard!.mapArea);
        vineyardLayer
            .setStyle({
                color: '#008515',
            })
            .addTo(this.map);
        this.map.setMaxBounds(vineyardLayer.getBounds());
        this.map.fitBounds(vineyardLayer.getBounds());

        this.map.on(Draw.Event.CREATED, (event: LayerEvent) => {
            const layer = event.layer as GeoJSON;
            this.drawnGrapevine.clearLayers();
            this.drawnGrapevine.addLayer(layer);
            console.log(this.drawnGrapevine.toGeoJSON());
            this.validateGrapevineLayer(this.drawnGrapevine.toGeoJSON());
        });

        this.drawCellars();
        this.drawGrapevines();
        this.handleCellarEvent();
    }

    getDrawFeatures(): Control.DrawConstructorOptions {
        return {
            position: 'bottomleft',
            draw: {
                polygon: false,
                marker: false,
                polyline: {
                    allowIntersection: false,
                    shapeOptions: {
                        clickable: true,
                        color: '#000',
                    },
                    showLength: false,
                },
                rectangle: false,
                circle: false,
                circlemarker: false,
            },
            edit: {
                featureGroup: this.drawnGrapevine,
            },
        };
    }

    validateGrapevineLayer(layer: any): void {
        this.grapevineService.validateGrapevine(layer).subscribe(response => {
            if (response) {
                this.drawnGrapevineValidated = true;
                this.drawnGrapevine.setStyle({ color: '#00ff00' });
                toast.success('Drawn linestring validation successful!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
                this.triggerDialog();
            } else {
                this.drawnGrapevineValidated = false;
                this.drawnGrapevine.setStyle({ color: '#ff0000' });
                toast.error('Drawn linestring is invalid!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
                setTimeout(() => {
                    this.drawnGrapevine.clearLayers();
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

    drawGrapevines(): void {
        this.user.vineyard!.grapevines!.forEach(grapevine => {
            this.grapevineLayers.addLayer(
                geoJSON(grapevine.geometry, {
                    onEachFeature: (_feature, layer) => {
                        // Popup
                        const card = this.vcr.createComponent(CustomcardComponent);
                        card.setInput('inputGrapevine', grapevine);
                        card.changeDetectorRef.detectChanges();
                        let popupalt = document.createElement('div');
                        popupalt.appendChild(card.location.nativeElement);
                        layer.bindPopup(popupalt).addTo(this.map);
                        layer.on('click', event => layer.openPopup(event.latlng));

                        // Tooltip
                        let tooltip: any = null;
                        let tooltipalt: HTMLElement | null = null;

                        layer.on('mouseover', event => {
                            tooltip = this.vcr.createComponent(CustomtooltipComponent);
                            tooltip.setInput('inputGrapevine', grapevine);
                            tooltip.changeDetectorRef.detectChanges();
                            tooltipalt = document.createElement('div');
                            tooltipalt.appendChild(tooltip.location.nativeElement);
                            layer.bindTooltip(tooltipalt, { permanent: false }).addTo(this.map);
                            layer.openTooltip(event.latlng);
                        });
                        layer.on('mouseout', () => {
                            layer.unbindTooltip();
                            if (tooltip) {
                                tooltip.destroy();
                                tooltip = null;
                            }
                            tooltipalt = null;
                        });
                    },
                }),
            );
        });

        this.grapevineLayers
            .setStyle({
                color: '#525252',
                weight: 6,
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

    addGrapevine(): void {
        this.grapevineService.createGrapevine(this.drawnGrapevine.toGeoJSON()).subscribe(user => {
            if (user) {
                toast.success('Grapevine created successfully!', {
                    position: 'bottom-center',
                });
            } else {
                toast.error('Grapevine creation failed!', {
                    position: 'bottom-center',
                });
                throw new Error();
            }
        });
        this.dialogService.setClosedState();
    }

    deleteGrapevine(id: number): void {}

    triggerDialog(): void {
        this.dialogService.setOpenState();
    }

    closeDialog(): void {
        this.drawnGrapevine.clearLayers();
        this.dialogService.setClosedState();
    }
}
