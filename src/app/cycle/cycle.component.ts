import { Component, OnInit, ViewEncapsulation, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Cycle, ICycle } from '../../model/cycle.model';
import { CycleService } from '../../model/cycle.service';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';
import { SearchService } from '../search/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CycleComponent implements OnInit, OnDestroy {
  cycles: Cycle[];
  patientId: string;
  diagnosticId: string;
  gridOptions: GridOptions;
  private searchSubscription: Subscription;
  @Output() onInitialized = new EventEmitter<boolean>();

  constructor(
    private cycleService: CycleService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private searchService: SearchService    
  ) {
    let gridReadyPromise = this.configureGrid();

    this.activeRoute.params.subscribe(params => {
      this.patientId = this.activeRoute.snapshot.params['patientId'];
      this.diagnosticId = this.activeRoute.snapshot.params['diagnosticId'];

      searchService.clearSearch();

      Promise.all([this.fetchEntity(), gridReadyPromise]).then(() => {
        this.onInitialized.emit(this.cycles && this.cycles.some(cycle=> cycle.Emitted));                //inform parent if there are emitted cycles or not
        this.gridOptions.api.setRowData(this.cycles);
        this.searchSubscription = searchService.search.subscribe(search => {
          if (this.gridOptions.api) this.gridOptions.api.setQuickFilter(search);
        });
      });
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  removeCycle(id: number): void {
    let promise = new Promise<boolean>((resolve, reject) => {
      let msg = `Sunteti sigur ca doriti sa stergeti tratament pacient?`,
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
      let subscription = this.cycleService.delete(id.toString()).subscribe(success => {
        if (success) {
          let deletedCycleIndex = this.cycles.findIndex(d => d.Id == id);

          if (deletedCycleIndex >= 0) {
            this.cycles.splice(deletedCycleIndex, 1);
            this.gridOptions.api.setRowData(this.cycles);
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
        columnDefs: [
          {
            headerName: 'Data inceput',
            field: "StartDate",
            width: 150,
            sort: 'desc',
            valueGetter: (params) => this.datePipe.transform(params.data.StartDate, 'dd/MM/yyyy')
          },
          {
            headerName: 'Data finalizare',
            field: "endDate",
            width: 150,
            sort: 'desc',
            valueGetter: (params) => this.datePipe.transform(params.data.endDate, 'dd/MM/yyyy')
          },
          {
            headerName: 'Tratament',
            field: "Treatment",
            width: 680,            
            cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">${params.data.Treatment.Name}</button></div>`,
            onCellClicked: (params) => {
              let id = params.data.Id;

              this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${this.diagnosticId}/cycle/${id}`);
            }
          },          
          {
            headerName: '',
            field: '',
            width: 80,
            cellRenderer: (params) => params.data.Emitted ? `` : `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Sterge</button></div>`,
            onCellClicked: (params) => {
              if (!params.data.Emitted) {
                let id = params.data.Id;

                this.removeCycle(id);
              }
            }
          }
        ]
      };
    });
  }

  private fetchEntity(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.diagnosticId) {
        let subscription = this.cycleService.getAllForDiagnosticId(this.diagnosticId).subscribe((cycles: ICycle[]) => {
          this.cycles = cycles.map(cycle => new Cycle(cycle, <any>0, new Date()));
          resolve();
          subscription.unsubscribe();
        });
      } else resolve();
    });
  }
}
