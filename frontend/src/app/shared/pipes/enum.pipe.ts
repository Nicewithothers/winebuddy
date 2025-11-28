import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'enum',
    standalone: true,
})
export class EnumPipe implements PipeTransform {
    transform(value: string | null, enumMap: Record<string, string>): string {
        if (!value) {
            return '';
        }

        return enumMap[value] || value;
    }
}
