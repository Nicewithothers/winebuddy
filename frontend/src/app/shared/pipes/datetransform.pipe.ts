import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datetransform',
})
export class DateTransformPipe implements PipeTransform {
    transform(value: string | Date): string {
        if (!value) {
            return '';
        }

        const date = new Date(value);
        const pad = (n: number) => n.toString().padStart(2, '0');

        const year = pad(date.getFullYear());
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hour = pad(date.getHours());
        const minute = pad(date.getMinutes());
        const second = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
}
