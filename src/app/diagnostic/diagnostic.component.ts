import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Diagnostic, IDiagnostic } from '../../model/diagnostic.model';
import { DiagnosticService } from '../../model/diagnostic.service';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';
import { SearchService } from '../search/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagnosticComponent implements OnInit, OnDestroy {
  diagnostics: Diagnostic[];
  selectedDiagnostic: Diagnostic;
  gridOptions: GridOptions;
  patientId: string;
  private searchSubscription: Subscription;
  @Output() onInitialized = new EventEmitter<boolean>();

  constructor(
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private diagnosticService: DiagnosticService,
    private messageService: MessageService,
    private searchService: SearchService
  ) {
    let gridReadyPromise = this.configureGrid();

    this.activeRoute.params.subscribe(params => {
      this.patientId = this.activeRoute.snapshot.params['patientId'];

      if (!this.diagnostics) this.diagnostics = [];

      searchService.clearSearch();

      Promise.all([this.fetchEntity(), gridReadyPromise]).then(() => {
        this.onInitialized.emit(this.diagnostics && !!this.diagnostics.length);             //inform parent if there are diagnostics or not
        this.gridOptions.api.setRowData(this.diagnostics);
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

  removeDiagnostic(id: number): void {
    let promise = new Promise<boolean>((resolve, reject) => {
      let msg = `Sunteti sigur ca doriti sa stergeti diagnostic-ul ?`,
        responses: [string, (string) => void][] = [
          ["Da", () => {
            resolve(true);
          }],
          ["Nu", () => {
            resolve(false);
          }]
        ],
        message = new Message(msg, false, responses);

      this.messageService.reportMessage(message);
    });

    promise.then((doDelete: boolean) => {
      this.messageService.removeMessage();
      if (!doDelete) return;
      let subscription = this.diagnosticService.delete(id.toString()).subscribe(success => {
        if (success) {
          let deletedDiagnosticIndex = this.diagnostics.findIndex(d => d.Id == id);

          if (deletedDiagnosticIndex >= 0) {
            this.diagnostics.splice(deletedDiagnosticIndex, 1);
            this.gridOptions.api.setRowData(this.diagnostics);
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
          let selectedDiagnostic = this.gridOptions.api.getSelectedRows();

          this.selectedDiagnostic = selectedDiagnostic && selectedDiagnostic.length ? selectedDiagnostic[0] : null;
        },
        columnDefs: [
          {
            headerName: 'Data',
            field: 'Date',
            width: 100,
            sort: 'asc',
            valueGetter: (params) => this.datePipe.transform(params.data.Date, 'dd/MM/yyyy')
          },
          {
            headerName: 'Descriere',
            field: "Description",
            width: 580,
            tooltip: (params) => params.data.Description,
            cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">${params.data.Description}</button></div>`,
            onCellClicked: (params) => {
              let id = params.data.Id;

              this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${id}`);
            }
          },
          {
            headerName: 'Localizare',
            field: "Localization",
            width: 300,
            tooltip: (params) => params.data.Localization
          },          
          {
            headerName: '',
            field: '',
            width: 80,
            cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Sterge</button></div>`,
            onCellClicked: (params) => {
              let id = params.data.Id;

              this.removeDiagnostic(id);
            }
          }
        ]
      }
    });
  }

  private fetchEntity(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.patientId) {
        this.diagnosticService.getAllForPatientId(this.patientId).subscribe((diagnostics: IDiagnostic[]) => {
          this.diagnostics = diagnostics.map(diagnostic => new Diagnostic(diagnostic));
          resolve();
        });
      } else resolve();
    });
  }
}
