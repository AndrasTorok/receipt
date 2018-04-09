import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Diagnostic } from '../../model/diagnostic.model';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagnosticComponent implements OnInit {
    @Input() diagnostics : Diagnostic[];
    selectedDiagnostic : Diagnostic;
    gridOptions: GridOptions;
    gridReadyPromise: Promise<any>;

  constructor(
    private datePipe: DatePipe  ,
    private router : Router  
  ) { 
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

    this.setGridColums();
  }

  ngOnInit() {
    Promise.all([this.gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.diagnostics);        
    });
  }

  private setGridColums(): void {
    this.gridOptions.columnDefs = [
      {
        headerName: 'Descriere',
        field: "Description",
        width: 200
      },
      {
        headerName: 'Localizare',
        field: "Localization",
        width: 100
      },      
      {
        headerName: 'Data',
        field: 'Date',
        width: 200,
        valueGetter: (params) => this.datePipe.transform(params.data.Date, 'dd/MM/yyyy')
      }    ,
      {
        headerName: '',
        field: '',
        width: 80,
        cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Editare</button></div>`,
        onCellClicked: (params) => {  
            let id = params.data.Id;

            this.router.navigateByUrl(`/diagnostic/${id}`);
        }
      }  
    ];
  }
}
