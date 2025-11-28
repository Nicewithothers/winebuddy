import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { FileService } from '../../shared/services/file.service';
import { User } from '../../shared/models/User';
import { toast } from 'ngx-sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { BaseChartDirective } from 'ng2-charts';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { ChartConfiguration } from 'chart.js';
import { grapeTypes } from '../../shared/models/enums/grape/GrapeType';
import { DateTransformPipe } from '../../shared/pipes/datetransform.pipe';

@Component({
    selector: 'app-profile',
    imports: [
        AsyncPipe,
        HlmCardImports,
        HlmAvatarImports,
        HlmButtonImports,
        NgOptimizedImage,
        HlmTabsImports,
        BaseChartDirective,
        HlmTypographyImports,
        DateTransformPipe,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
    user!: User;
    selectedPreviewImage: string | null = null;
    selectedImage: File | null = null;
    grapevinePieData: ChartConfiguration['data'] = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'rgba(147, 51, 234, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(234, 179, 8, 0.7)',
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(156, 163, 175, 0.7)',
                ],
                borderColor: [
                    'rgb(147, 51, 234)',
                    'rgb(239, 68, 68)',
                    'rgb(234, 179, 8)',
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(236, 72, 153)',
                    'rgb(156, 163, 175)',
                ],
                borderWidth: 1,
            },
        ],
    };

    grapevinePieOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'center',
            },
            title: {
                display: true,
                text: 'Grapevines by grape types',
            },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const label = ctx.label || '';
                        const value = ctx.parsed || 0;
                        const total = this.user!.vineyard!.grapevines!.length;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} vines (${percentage}%)`;
                    },
                },
            },
        },
    };

    cellarBarData: ChartConfiguration['data'] = {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Sum of cellar wine volumes (l)',
                backgroundColor: 'rgba(139, 69, 19, 1)',
                borderColor: 'rgba(205, 133, 63, 1)',
                borderWidth: 1,
            },
        ],
    };

    cellarBarOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'center',
            },
            title: {
                display: true,
                text: 'Sum of cellar wine volumes (l)',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: tickValue => {
                        return `${tickValue} db`;
                    },
                },
                min: 1,
            },
        },
    };

    constructor(
        protected authService: AuthService,
        private fileService: FileService,
    ) {}

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
        this.processGrapevineData();
        this.processCellarData();
    }

    protected openImageDialog(): void {
        const fileInput = document.querySelector('#picture') as HTMLElement;
        fileInput.click();
    }

    onImageSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            this.selectedImage = file;
            reader.onload = e => {
                this.selectedPreviewImage = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    uploadProfile() {
        if (this.selectedImage) {
            this.fileService
                .uploadProfile(this.user.username, this.selectedImage)
                .subscribe(user => {
                    if (user) {
                        this.user = user;
                        toast.success('Picture updated successfully', {
                            position: 'top-right',
                        });
                    }
                });
        }
    }

    private processCellarData(): void {
        if (!this.user.vineyard?.cellars) {
            return;
        }
        this.cellarBarData.labels = this.user.vineyard!.cellars!.map(c => c.name);
        this.cellarBarData.datasets[0].data = this.user.vineyard!.cellars!.map(c => c.capacity);
    }

    private processGrapevineData(): void {
        if (!this.user.vineyard?.grapevines) {
            return;
        }

        const grapeGroups = new Map<string, number>();

        this.user.vineyard!.grapevines!.map(gv => {
            const grapeType =
                grapeTypes.find(gt => gt.value === gv.grape?.grapeType)?.label || 'Empty';
            grapeGroups.set(grapeType, (grapeGroups.get(grapeType) || 0) + 1);
        });

        const labels: string[] = [];
        const data: number[] = [];

        grapeGroups.forEach((count, gt) => {
            labels.push(gt);
            data.push(count);
        });

        this.grapevinePieData.labels = labels;
        this.grapevinePieData.datasets[0].data = data;
    }
}
