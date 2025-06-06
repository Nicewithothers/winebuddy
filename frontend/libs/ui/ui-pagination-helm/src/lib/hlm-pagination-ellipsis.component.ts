import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Component({
    selector: 'hlm-pagination-ellipsis',
    imports: [NgIcon, HlmIconDirective],
    providers: [provideIcons({ lucideEllipsis })],
    template: `
        <span [class]="_computedClass()">
            <ng-icon hlm size="sm" name="lucideEllipsis" />
            <span class="sr-only">More pages</span>
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmPaginationEllipsisComponent {
    public readonly userClass = input<ClassValue>('', { alias: 'class' });

    protected readonly _computedClass = computed(() =>
        hlm('flex h-9 w-9 items-center justify-center', this.userClass()),
    );
}
