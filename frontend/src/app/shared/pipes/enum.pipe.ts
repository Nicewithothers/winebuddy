import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'enum',
})
export class EnumPipe implements PipeTransform {
    transform(transformKey: string, transformEnum: any): any {
        return transformEnum[transformKey] || transformKey;
    }
}
