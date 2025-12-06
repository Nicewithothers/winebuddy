import { Component, computed, OnInit, signal } from '@angular/core';
import {
    ColumnDef,
    ColumnFiltersState,
    createAngularTable,
    FlexRenderDirective,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    SortingState,
    VisibilityState,
} from '@tanstack/angular-table';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NG_ICON_DIRECTIVES, provideIcons } from '@ng-icons/core';
import { User } from '../../../shared/models/User';
import { AuthService } from '../../../shared/services/auth.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { toast } from 'ngx-sonner';
import { AsyncPipe } from '@angular/common';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { wineForm } from '../../../shared/forms/wine.form';
import { WineService } from '../../../shared/services/wine.service';
import { WineRequest } from '../../../shared/models/requests/WineRequest';
import { grapeTypes } from '../../../shared/models/enums/grape/GrapeType';
import { HlmInput } from '@spartan-ng/helm/input';
import { lucidePlus } from '@ng-icons/lucide';
import { Wine } from '../../../shared/models/Wine';
import { Cellar } from '../../../shared/models/Cellar';

@Component({
    selector: 'app-wine-dashboard',
    imports: [
        AsyncPipe,
        HlmSelectImports,
        BrnSelectImports,
        HlmTableImports,
        HlmButtonImports,
        BrnAlertDialogImports,
        HlmIconImports,
        NG_ICON_DIRECTIVES,
        HlmAlertDialogImports,
        HlmTypographyImports,
        HlmDialogImports,
        BrnDialogImports,
        ReactiveFormsModule,
        HlmFormFieldImports,
        FlexRenderDirective,
        HlmInput,
    ],
    providers: provideIcons({ lucidePlus }),
    templateUrl: './wine-dashboard.component.html',
    styleUrl: './wine-dashboard.component.css',
})
export class WineDashboardComponent implements OnInit {
    user!: User;
    wineForm: FormGroup = wineForm();
    protected readonly grapeTypes = grapeTypes;
    selectedCellar: Cellar | null = null;

    constructor(
        protected authService: AuthService,
        private wineService: WineService,
        private dialogService: DialogService,
    ) {}

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });

        this.loadWineData(this.user);
    }

    handleCurrentCellar(newCellar: Cellar): void {
        this.selectedCellar = newCellar;
    }

    // Data table for wines

    private readonly _columnFilters = signal<ColumnFiltersState>([]);
    private readonly _sorting = signal<SortingState>([]);
    private readonly _rowSelection = signal<RowSelectionState>({});
    private readonly _columnVisibility = signal<VisibilityState>({});

    private tabledata = signal<Wine[]>([]);

    protected readonly _columns: ColumnDef<Wine>[] = [
        {
            accessorKey: 'name',
            id: 'name',
            header: 'Name',
            enableSorting: false,
            cell: info => `<div>${info.getValue<string>()}</div>`,
        },
        {
            accessorKey: 'yearOfCreation',
            id: 'yearOfCreation',
            header: 'Year',
            enableSorting: false,
            cell: info => `<div>${info.getValue<number>()}</div>`,
        },
        {
            accessorKey: 'alcoholPercentage',
            id: 'alcoholPercentage',
            header: 'Alcohol',
            enableSorting: true,
            cell: info => `<div class="text-right">${info.getValue<number>()} %</div>`,
        },
        {
            id: 'grapes',
            header: 'Grapes',
            enableSorting: false,
            accessorFn: row => row.grapes.map(grape => grape.grapeType) || null,
        },
        {
            accessorKey: 'quantity',
            id: 'quantity',
            header: 'Quantity (db)',
            enableSorting: false,
            cell: info => `<div class="text-right">${info.getValue<number>()}</div>`,
        },
    ];

    protected readonly _table = createAngularTable<Wine>(() => ({
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
                pageSize: 8,
            },
        },
    }));

    private loadWineData(user: User) {
        const cellars = user.vineyard?.cellars ?? [];
        const allWines = cellars.flatMap(c => {
            return c.wines!.map(b => b);
        });

        this.tabledata.set(allWines);
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
            (this.wineForm.get('name')?.invalid ||
                this.wineForm.get('grapeTypes')?.invalid ||
                this.wineForm.get('quantity')?.invalid)
        );
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
    }

    addWines(): void {
        const wineName = this.wineForm.get('name')?.value;
        const grapeTypes = this.wineForm.get('grapeTypes')?.value;
        const quantity = this.wineForm.get('quantity')?.value;
        const wineRequest: WineRequest = {
            name: wineName,
            grapeTypes: grapeTypes,
            quantity: quantity,
            cellarId: this.selectedCellar!.id,
        };
        this.wineService.createWines(wineRequest).subscribe(user => {
            if (user) {
                this.updateCurrentCellar(this.selectedCellar);
                this.tabledata.set(this.selectedCellar!.wines || []);
                toast.success('Barrel creation successful!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
                this.dialogService.setClosedState();
            } else {
                toast.error('Barrel creation failed!', {
                    position: 'bottom-center',
                    duration: 2000,
                });
            }
        });
    }
}
