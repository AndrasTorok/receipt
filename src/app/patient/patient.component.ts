import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { PatientService } from '../../model/patient.service';
import { Patient } from '../../model/patient.model';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';

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
  gridReady: boolean = false;
  private _quickFilterText: string = '';

  constructor(
    private patientService: PatientService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    let gridReadyPromise = this.configureGrid();

    Promise.all([this.fetchEntities(), gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.patients);
      this.gridReady = true;
    });
  }

  ngOnInit() {
    
  }

  get quickFilterText(): string { return this._quickFilterText; }

  set quickFilterText(value: string) {
    this._quickFilterText = value;
    this.gridOptions.api.setQuickFilter(value);
  }

  add(): void {
    this.router.navigateByUrl(`/patient/`);
  }

  removePatient(id: number) {
    let promise = new Promise<boolean>((resolve, reject) => {
      let msg = `Sunteti sigur ca doriti sa stergeti pacient-ul?`,
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
      let subscription = this.patientService.delete(id.toString()).subscribe(success => {
        if (success) {
          let deletedPatientIndex = this.patients.findIndex(d => d.Id == id);

          if (deletedPatientIndex >= 0) {
            this.patients.splice(deletedPatientIndex, 1);
            this.gridOptions.api.setRowData(this.patients);
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
          let selectedPatient = this.gridOptions.api.getSelectedRows();

          this.selectedPatient = selectedPatient && selectedPatient.length ? selectedPatient[0] : null;
        },
        columnDefs: [
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
          },
          {
            headerName: '',
            field: '',
            width: 80,
            cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Sterge</button></div>`,
            onCellClicked: (params) => {
              let id = params.data.Id;
    
              this.removePatient(id);
            }
          }
        ]
      };
    });
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
