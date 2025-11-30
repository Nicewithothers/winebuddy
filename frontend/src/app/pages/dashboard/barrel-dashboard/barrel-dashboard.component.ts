import { Component, computed, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../shared/models/User';
import { AuthService } from '../../../shared/services/auth.service';
import { barrelForm } from '../../../shared/forms/barrel.form';
import { lucideChevronDown, lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { Cellar } from '../../../shared/models/Cellar';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { BarrelType, barrelTypes } from '../../../shared/models/enums/barrel/BarrelType';
import { BarrelSize, barrelSizes } from '../../../shared/models/enums/barrel/BarrelSize';
import { BarrelRequest } from '../../../shared/models/requests/BarrelRequest';
import { BarrelService } from '../../../shared/services/barrel.service';
import { toast } from 'ngx-sonner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
    createAngularTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    RowSelectionState,
    ColumnDef,
    FlexRenderDirective,
} from '@tanstack/angular-table';
import { Barrel } from '../../../shared/models/Barrel';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { EnumPipe } from '../../../shared/pipes/enum.pipe';
import { max } from 'rxjs';
import { Grape } from '../../../shared/models/Grape';
import { GrapeType } from '../../../shared/models/enums/grape/GrapeType';

@Component({
    selector: 'app-barrel-dashboard',
    imports: [
        AsyncPipe,
        NgIcon,
        LeafletModule,
        LeafletDrawModule,
        ReactiveFormsModule,
        BrnDialogImports,
        HlmSelectImports,
        BrnSelectImports,
        HlmButtonImports,
        HlmTypographyImports,
        HlmDialogImports,
        HlmFormFieldImports,
        HlmTableImports,
        BrnMenuImports,
        HlmMenuImports,
        FlexRenderDirective,
    ],
    providers: [provideIcons({ lucideTrash2, lucidePlus, lucideChevronDown })],
    templateUrl: './barrel-dashboard.component.html',
    styleUrl: './barrel-dashboard.component.css',
})
export class BarrelDashboardComponent implements OnInit {
    user!: User;
    barrelForm: FormGroup = barrelForm();
    selectedCellar: Cellar | null = null;
    enumPipe: EnumPipe = new EnumPipe();
    barrelTypes = barrelTypes;
    barrelSizes = barrelSizes;

    constructor(
        protected authService: AuthService,
        private barrelService: BarrelService,
    ) {}

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });

        this.loadBarrelData(this.user);
    }

    // Data table for barrels

    private readonly _columnFilters = signal<ColumnFiltersState>([]);
    private readonly _sorting = signal<SortingState>([]);
    private readonly _rowSelection = signal<RowSelectionState>({});
    private readonly _columnVisibility = signal<VisibilityState>({});

    private tabledata = signal<Barrel[]>([]);

    protected _filterChanged(event: Event) {
        this._table.getColumn('cellar')?.setFilterValue((event.target as HTMLInputElement).value);
    }

    protected readonly _columns: ColumnDef<Barrel>[] = [
        {
            id: 'select',
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'barrelType',
            id: 'barrelType',
            header: 'Type',
            enableSorting: true,
            cell: info =>
                `<span>${this.enumPipe.transform(info.getValue<string>(), BarrelType)}</span>`,
        },
        {
            accessorKey: 'barrelSize',
            id: 'barrelSize',
            header: 'Size',
            enableSorting: false,
            cell: info =>
                `<div>${this.enumPipe.transform(info.getValue<string>(), BarrelSize)}</div>`,
        },
        {
            id: 'volume',
            header: 'Volume',
            enableSorting: false,
            cell: info => {
                const row = info.row.original;
                return `<div class="text-right">${row.volume}/${row.maxVolume}</div>`;
            },
        },
        {
            id: 'grape',
            header: 'Grape',
            enableSorting: false,
            accessorFn: row => row.grape?.grapeType,
            cell: info =>
                `<div class="text-right">${this.enumPipe.transform(info.getValue<string>() ?? 'X', GrapeType)}</div>`,
        },
        {
            id: 'actions',
            enableHiding: false,
        },
    ];

    protected readonly _table = createAngularTable<Barrel>(() => ({
        data: this.tabledata(),
        columns: this._columns,
        onSortingChange: updater => {
            updater instanceof Function
                ? this._sorting.update(updater)
                : this._sorting.set(updater);
        },
        onColumnFiltersChange: updater => {
            updater instanceof Function
                ? this._columnFilters.update(updater)
                : this._columnFilters.set(updater);
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: updater => {
            updater instanceof Function
                ? this._columnVisibility.update(updater)
                : this._columnVisibility.set(updater);
        },
        onRowSelectionChange: updater => {
            updater instanceof Function
                ? this._rowSelection.update(updater)
                : this._rowSelection.set(updater);
        },
        state: {
            sorting: this._sorting(),
            columnFilters: this._columnFilters(),
            columnVisibility: this._columnVisibility(),
            rowSelection: this._rowSelection(),
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    }));

    protected readonly _hidableColumns = this._table
        .getAllColumns()
        .filter(column => column.getCanHide());

    private loadBarrelData(user: User) {
        const cellars = user.vineyard?.cellars ?? [];
        const allBarrels = cellars.flatMap(c => {
            return c.barrels!.map(b => b);
        });

        this.tabledata.set(allBarrels);
    }

    pageInformation = computed(() => {
        const table = this._table;
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const paginationSize = table.getFilteredRowModel().rows.length;

        const start = pageIndex * pageSize + 1; // Starting element changing with page change
        const end = Math.min((pageIndex + 1) * pageSize, paginationSize); // Ending element changing with page change

        return {
            start,
            end,
            paginationSize,
        };
    });

    // End of data table section

    checkFields(): boolean {
        return <boolean>(
            (this.barrelForm.get('maxVolume')?.invalid ||
                this.barrelForm.get('barrelType')?.invalid ||
                this.barrelForm.get('barrelSize')?.invalid)
        );
    }

    handleCurrentBarrel(newBarrel: Cellar): void {
        this.selectedCellar = newBarrel;
    }

    addBarrel(id: number): void {
        const barrelType = this.barrelForm.get('barrelType')?.value;
        const barrelSize = this.barrelForm.get('barrelSize')?.value;
        const barrelRequest: BarrelRequest = {
            cellarId: id,
            barrelType: barrelType,
            barrelSize: barrelSize,
        };
        this.barrelService.createBarrel(barrelRequest).subscribe(user => {
            if (user) {
                this.updateCurrentCellar(this.selectedCellar);
                toast.success('Barrel creation successful!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
            } else {
                toast.error('Barrel creation failed!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
            }
        });
    }

    updateCurrentCellar(currentCellar: Cellar | null): void {
        if (currentCellar) {
            this.user!.vineyard!.cellars!.forEach(cellar => {
                if (cellar.id === currentCellar.id) {
                    this.selectedCellar = cellar;
                }
                return;
            });
        }
        return;
    }

    deleteBarrel(id: number): void {}
}
