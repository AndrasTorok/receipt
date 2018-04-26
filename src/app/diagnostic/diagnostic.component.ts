import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Diagnostic, IDiagnostic } from '../../model/diagnostic.model';
import { DiagnosticService } from '../../model/diagnostic.service';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagnosticComponent implements OnInit {
  diagnostics: Diagnostic[];
  selectedDiagnostic: Diagnostic;
  gridOptions: GridOptions;
  patientId: string;

  constructor(
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private diagnosticService: DiagnosticService,
    private messageService: MessageService
  ) {
    let gridReadyPromise = this.configureGrid();
    
    this.activeRoute.params.subscribe(params => {
      this.patientId = this.activeRoute.snapshot.params['patientId'];

      if (!this.diagnostics) this.diagnostics = [];

      Promise.all([this.fetchEntities(), gridReadyPromise]).then(() => {
        this.gridOptions.api.setRowData(this.diagnostics);
      });
    });    
  }

  ngOnInit() {

  }

  removeDiagnostic(id: number): void {
    let promise = new Promise<boolean>((resolve, reject) => {
      let msg = `Sunteti sigur ca doriti sa stergeti diagnostic-ul ?`,
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
        //angularCompileRows: true,
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
            valueGetter: (params) => this.datePipe.transform(params.data.Date, 'dd/MM/yyyy')
          },
          {
            headerName: 'Descriere',
            field: "Description",
            width: 400,
            tooltip: (params) => params.data.Description
          },
          {
            headerName: 'Localizare',
            field: "Localization",
            width: 400,
            tooltip: (params) => params.data.Localization
          },
          {
            headerName: '',
            field: '',
            width: 80,
            cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Editare</button></div>`,
            onCellClicked: (params) => {
              let id = params.data.Id;

              this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${id}`);
            }
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

  private fetchEntities(): Promise<any> {
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
