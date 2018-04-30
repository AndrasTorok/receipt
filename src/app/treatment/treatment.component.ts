import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GridOptions, GridApi } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { TreatmentService } from '../../model/treatment.service';
import { Treatment } from '../../model/treatment.model';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';
import { SearchService } from '../search/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TreatmentComponent implements OnInit, OnDestroy {
  treatments: Treatment[];
  selectedTreatment: Treatment;
  gridOptions: GridOptions;
  private searchSubscription: Subscription;

  constructor(
    private treatmentService: TreatmentService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private searchService: SearchService
  ) {
    let gridReadyPromise = this.configureGrid();

    searchService.clearSearch();

    Promise.all([this.fetchEntities(), gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.treatments);
      this.searchSubscription = searchService.search.subscribe(search => {
        if(this.gridOptions.api) this.gridOptions.api.setQuickFilter(search);
      });
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  removeTreatment(id: number): void {
    let promise = new Promise<boolean>((resolve, reject) => {
      let msg = `Sunteti sigur ca doriti sa stergeti schema de tratament ?`,
        responses: [string, (string) => void][] = [
          ["Da", () => {
            this.messageService.removeMessage();
            resolve(true);
          }],
          ["Nu", () => {
            this.messageService.removeMessage();
            resolve(false);
          }]
        ],
        message = new Message(msg, false, responses);

      this.messageService.reportMessage(message);
    });

    promise.then((doDelete: boolean) => {
      if (!doDelete) return;
      let subscription = this.treatmentService.delete(id.toString()).subscribe(success => {
        if (success) {
          let deletedTreatmentIndex = this.treatments.findIndex(d => d.Id == id);

          if (deletedTreatmentIndex >= 0) {
            this.treatments.splice(deletedTreatmentIndex, 1);
            this.gridOptions.api.setRowData(this.treatments);
          }
        }
        subscription.unsubscribe();
      });
    });
  }

  private configureGrid(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gridOptions = <GridOptions>{
        enableFilter: true,
        enableSorting: true,
        sortingOrder: ['asc', 'desc', null],
        pagination: true,
        paginationAutoPageSize: true,
        rowSelection: 'single',
        rowHeight: 30,
        onGridReady: () => {          
          resolve();
        },
        onSelectionChanged: () => {

        },
        columnDefs: [
          {
            headerName: 'Tratament',
            field: "Name",
            width: 500,
            sort: 'asc'
          },
          {
            headerName: '',
            field: '',
            width: 80,
            cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Editare</button></div>`,
            onCellClicked: (params) => {
              let id = params.data.Id;

              this.router.navigateByUrl(`/treatment/${id}`);
            }
          },
          {
            headerName: '',
            field: '',
            width: 80,
            cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Sterge</button></div>`,
            onCellClicked: (params) => {
              let id = params.data.Id;

              this.removeTreatment(id);
            }
          }
        ]
      };
    });
  }

  private fetchEntities(): Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.treatmentService.fetchEntityAndUnsubscribe((entities) => this.treatments = entities.map(p => new Treatment(p)))
      ]).then(() => {
        resolve();
      });
    });
  }
}
