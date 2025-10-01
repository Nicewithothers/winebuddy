import { Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    protected readonly _layerValidation = signal<boolean>(false);
    private readonly _debouncedState$ = toObservable(this._layerValidation).pipe(
        debounceTime(0),
        map(validation => (validation ? 'open' : 'closed')),
    );
    readonly _state = toSignal(this._debouncedState$, {
        initialValue: 'closed' as 'open' | 'closed',
    });

    constructor() {
        this._layerValidation.set(false);
    }

    setOpenState(): void {
        this._layerValidation.set(true);
    }

    setClosedState(): void {
        this._layerValidation.set(false);
    }
}
