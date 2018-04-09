import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { PatientService } from '../../model/patient.service';
import { Patient } from '../../model/patient.model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientComponent implements OnInit {
  patients: Patient[];
  selectedPatient: Patient;
  gridOptions: GridOptions;
  gridReadyPromise: Promise<any>;
  gridReady: boolean = false;
  private _quickFilterText: string = '';

  constructor(
    private patientService: PatientService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private router: Router
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
        let selectedPatient = this.gridOptions.api.getSelectedRows();

        this.selectedPatient = selectedPatient && selectedPatient.length ? selectedPatient[0] : null;
      }
    };

    this.setGridColums();
  }

  ngOnInit() {
    Promise.all([this.fetchEntities(), this.gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.patients);
      this.gridReady = true;
    });
  }

  get quickFilterText(): string { return this._quickFilterText; }

  set quickFilterText(value: string) {
    this._quickFilterText = value;
    this.gridOptions.api.setQuickFilter(value);
  }

  add(): void {
    this.router.navigateByUrl(`/person/`);
  }

  private setGridColums(): void {
    this.gridOptions.columnDefs = [
      {
        headerName: 'CNP',
        field: "CNP",
        width: 130
      },
      {
        headerName: 'Nume',
        field: "LastName",
        width: 100
      },
      {
        headerName: 'Prenume',
        field: "FirstName",
        width: 100
      },
      {
        headerName: 'Sex',
        field: 'GenderDisplay',
        width: 80
      },
      {
        headerName: 'Data nasterii',
        field: 'BirthDate',
        width: 200,
        valueGetter: (params) => this.datePipe.transform(params.data.BirthDate, 'dd/MM/yyyy')
      },
      {
        headerName: 'Inaltime',
        field: 'Height',
        width: 80
      },
      {
        headerName: 'Greutate',
        field: 'Weight',
        width: 80
      },
      {
        headerName: '',
        field: '',
        width: 80,
        cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Editare</button></div>`,
        onCellClicked: (params) => {  
            let id = params.data.Id;

            this.router.navigateByUrl(`/patient/${id}`);
        }
      }
    ];
  }

  private fetchEntities(): Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.patientService.fetchEntityAndUnsubscribe((entities) => this.patients = entities.map(p => new Patient(p)))
      ]).then(() => {
        resolve();
      });
    });
  }  
}
