import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PatientService } from '../../model/patient.service';
import { Patient } from '../../model/patient.model';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';
import { SearchService } from '../search/search.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientComponent implements OnInit, OnDestroy {
  patients: Patient[];
  selectedPatient: Patient;
  gridOptions: GridOptions;
  private searchSubscription: Subscription;

  constructor(
    private patientService: PatientService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private searchService: SearchService
  ) {
    const gridReadyPromise = this.configureGrid();

    searchService.clearSearch();

    Promise.all([this.fetchEntity(), gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.patients);

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

  add(): void {
    this.router.navigateByUrl(`/patient/`);
  }

  removePatient(id: number) {
    const promise = new Promise<boolean>((resolve, reject) => {
      const msg = `Sunteti sigur ca doriti sa stergeti pacient-ul?`,
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
        const subscription = this.patientService.delete(id.toString()).subscribe(success => {
          if (success) {
            const deletedPatientIndex = this.patients.findIndex(d => d.Id === id);

            if (deletedPatientIndex >= 0) {
              this.patients.splice(deletedPatientIndex, 1);
              this.gridOptions.api.setRowData(this.patients);
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
          resolve();
        },
        onSelectionChanged: () => {
          const selectedPatient = this.gridOptions.api.getSelectedRows();

          this.selectedPatient = selectedPatient && selectedPatient.length ? selectedPatient[0] : null;
        },
        columnDefs: [
          {
            headerName: 'CNP',
            field: 'CNP',
            width: 130,
            cellRenderer: (params) =>
              `<div style='vertical-align: middle;'><button class='btn btn-sm btn-link'>${params.data.CNP}</button></div>`,
            onCellClicked: (params) => {
              const id = params.data.Id;

              this.router.navigateByUrl(`/patient/${id}`);
            }
          },
          {
            headerName: 'Nume',
            field: 'LastName',
            width: 200,
            sort: 'asc'
          },
          {
            headerName: 'Prenume',
            field: 'FirstName',
            width: 200,
            sort: 'asc'
          },
          {
            headerName: 'Sex',
            field: 'GenderDisplay',
            width: 50
          },
          {
            headerName: 'Data nasterii',
            field: 'BirthDate',
            width: 100,
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
            cellRenderer: (params) => `<div style='vertical-align: middle;'><button class='btn btn-sm btn-link'>Sterge</button></div>`,
            onCellClicked: (params) => {
              const id = params.data.Id;

              this.removePatient(id);
            }
          }
        ]
      };
    });
  }

  private fetchEntity(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        this.patientService.fetchEntityAndUnsubscribe((entities) => this.patients = entities.map(p => new Patient(p)))
      ]).then(() => {
        resolve();
      });
    });
  }
}
