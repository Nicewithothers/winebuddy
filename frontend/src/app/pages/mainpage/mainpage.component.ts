import { Component } from '@angular/core';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { carouselItems } from '../../shared/models/other/CarouselItem';
import { NgOptimizedImage } from '@angular/common';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-mainpage',
    imports: [HlmCarouselImports, NgOptimizedImage, HlmTypographyImports],
    templateUrl: './mainpage.component.html',
    styleUrl: './mainpage.component.css',
    standalone: true,
})
export class MainpageComponent {
    protected readonly plugins = [Autoplay({ delay: 5000 }), Fade()];
    protected readonly options = {
        watchDrag: false,
    };
    protected readonly carouselItems = carouselItems;
}
