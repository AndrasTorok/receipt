import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Diagnostic, IDiagnostic } from '../../model/diagnostic.model';
import { DiagnosticService } from '../../model/diagnostic.service';

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
  gridReadyPromise: Promise<any>;
  patientId: string;

  constructor(
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private diagnosticService: DiagnosticService
  ) {
    this.patientId = this.activeRoute.snapshot.params['patientId'];

    this.configureGrid();
  }

  ngOnInit() {
    if (!this.diagnostics) this.diagnostics = [];

    Promise.all([this.fetchEntities(), this.gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.diagnostics);
    });
  }

  removeDiagnostic(id: number): void {
    let subscription = this.diagnosticService.delete(id.toString()).subscribe(success => {
      if (success) {
        let deletedDiagnosticIndex = this.diagnostics.findIndex(d => d.Id == id);

        if (deletedDiagnosticIndex) {
          this.diagnostics.splice(deletedDiagnosticIndex, 1);
          this.gridOptions.api.setRowData(this.diagnostics);
        }
      }
      subscription.unsubscribe();
    });
  } 

  private configureGrid(): void {
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
        this.gridReadyPromise = new Promise((resolve, reject) => {
          resolve();
        });
      },
      onSelectionChanged: () => {
        let selectedDiagnostic = this.gridOptions.api.getSelectedRows();

        this.selectedDiagnostic = selectedDiagnostic && selectedDiagnostic.length ? selectedDiagnostic[0] : null;
      }
    };

    this.gridOptions.columnDefs = [
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
        tooltip: (params)=> params.data.Description
      },
      {
        headerName: 'Localizare',
        field: "Localization",
        width: 400,
        tooltip: (params)=> params.data.Localization
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
    ];
  }

  private fetchEntities(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.diagnosticService.getAllForPatientId(this.patientId).subscribe((diagnostics: IDiagnostic[]) => {
        this.diagnostics = diagnostics.map(diagnostic => new Diagnostic(diagnostic));
        resolve();
      });
    });
  }
}
