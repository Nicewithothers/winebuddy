import { DateTransformPipe } from '../../../pipes/datetransform.pipe';
import { DecimalPipe } from '@angular/common';

export enum BarrelSize {
    SMALL = 'Small',
    MEDIUM = 'Medium',
    LARGE = 'Large',
}

export const barrelSizes = Object.entries(BarrelSize).map(([value, label]) => ({
    value: value,
    label: label,
}));
