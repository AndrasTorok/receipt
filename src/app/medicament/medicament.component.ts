import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid/main';
import { ActivatedRoute, Router } from '@angular/router';
import { Medicament, DoseApplicationModeEnumeration } from '../../model/medicament.model';
import { MedicamentService } from '../../model/medicament.service';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';
import { SearchService } from '../search/search.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-medicament',
  templateUrl: './medicament.component.html',
  styleUrls: ['./medicament.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MedicamentComponent implements OnInit, OnDestroy {
  medicaments: Medicament[];
  selectedMedicament: Medicament;
  gridOptions: GridOptions;
  gridReady = false;
  private searchSubscription: Subscription;

  constructor(
    private medicamentService: MedicamentService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private searchService: SearchService
  ) {
    const gridReadyPromise = this.configureGrid();

    searchService.clearSearch();

    Promise.all([this.fetchEntity(), gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.medicaments);
      this.searchSubscription = searchService.search.subscribe(search => {
        if (this.gridOptions.api) {
          this.gridOptions.api.setQuickFilter(search);
        }
      });
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  removeMedicament(id: number): void {
    const promise = new Promise<boolean>((resolve, reject) => {
      const msg = `Sunteti sigur ca doriti sa stergeti medicament-ul ?`,
        responses: [string, (string) => void][] = [
          ['Da', () => {
            this.messageService.removeMessage();
            resolve(true);
          }],
          ['Nu', () => {
            this.messageService.removeMessage();
            resolve(false);
          }]
        ],
        message = new Message(msg, false, responses);

      this.messageService.reportMessage(message);
    });

    promise.then((doDelete: boolean) => {
      if (doDelete) {
        const subscription = this.medicamentService.delete(id.toString()).subscribe(success => {
          if (success) {
            const deletedMedicamentIndex = this.medicaments.findIndex(d => d.Id === id);

            if (deletedMedicamentIndex >= 0) {
              this.medicaments.splice(deletedMedicamentIndex, 1);
              this.gridOptions.api.setRowData(this.medicaments);
            }
          }
          subscription.unsubscribe();
        });
      }
    });
  }

  private configureGrid(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this.gridOptions = <GridOptions>{
        enableFilter: true,
        enableSorting: true,
        sortingOrder: ['asc', 'desc', null],
        pagination: true,
        paginationAutoPageSize: true,
        rowSelection: 'single',
        rowHeight: 30,
        onGridReady: () => {
          this.gridReady = true;
          resolve();
        },
        onSelectionChanged: () => {

        },
        columnDefs: [
          {
            headerName: 'Medicament',
            field: 'Name',
            width: 700,
            sort: 'asc',
            cellRenderer: (params) =>
              `<div style='vertical-align: middle;'><button class='btn btn-sm btn-link'>${params.data.Name}</button></div>`,
            onCellClicked: (params) => {
              const id = params.data.Id;

              this.router.navigateByUrl(`/medicament/${id}`);
            }
          },
          {
            headerName: 'Mod aplicare',
            field: 'DoseApplicationMode',
            width: 150,
            valueGetter: (params) => DoseApplicationModeEnumeration.get(params.data.DoseApplicationMode)
          },
          {
            headerName: 'Sterge',
            field: '',
            width: 80,
            cellRenderer: (params) => `<div style='vertical-align: middle;'><button class='btn btn-sm btn-link'>Sterge</button></div>`,
            onCellClicked: (params) => {
              const id = params.data.Id;

              this.removeMedicament(id);
            }
          }
        ]
      };
    });
  }

  private fetchEntity(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        this.medicamentService.fetchEntityAndUnsubscribe((entities) => this.medicaments = entities.map(p => new Medicament(p)))
      ]).then(() => {
        resolve();
      });
    });
  }
}
