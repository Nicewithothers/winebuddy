import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    booleanAttribute,
    computed,
    inject,
    input,
} from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnColumnDefComponent } from '@spartan-ng/brain/table';
import type { ClassValue } from 'clsx';

@Component({
    selector: 'hlm-td',
    imports: [NgTemplateOutlet],
    host: {
        '[class]': '_computedClass()',
    },
    template: `
        <ng-template #content>
            <ng-content />
        </ng-template>
        @if (truncate()) {
            <span class="flex-1 truncate">
                <ng-container [ngTemplateOutlet]="content" />
            </span>
        } @else {
            <ng-container [ngTemplateOutlet]="content" />
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class HlmTdComponent {
    private readonly _columnDef? = inject(BrnColumnDefComponent, { optional: true });
    public readonly truncate = input(false, { transform: booleanAttribute });

    public readonly userClass = input<ClassValue>('', { alias: 'class' });
    protected readonly _computedClass = computed(() =>
        hlm(
            'flex flex-none p-4 items-center [&:has([role=checkbox])]:pr-0',
            this._columnDef?.class(),
            this.userClass(),
        ),
    );
}
