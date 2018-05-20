import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid/main';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TreatmentService } from '../../model/treatment.service';
import { Treatment } from '../../model/treatment.model';
import { TreatmentItemService } from '../../model/treatment-item.service';
import { DoseApplicationModeEnumeration } from '../../model/medicament.model';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';

@Component({
  selector: 'app-treatment-detail',
  templateUrl: './treatment-detail.component.html',
  styleUrls: ['./treatment-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TreatmentDetailComponent implements OnInit {
  treatmentId: string;
  treatment: Treatment;
  gridOptions: GridOptions;
  gridReadyPromise: Promise<any>;
  gridReady = false;
  private formState: FormState;

  constructor(
    private treatmentService: TreatmentService,
    private treatmentItemService: TreatmentItemService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.activeRoute.params.subscribe(params => {
      this.treatmentId = this.activeRoute.snapshot.params['treatmentId'];
      this.formState = this.treatmentId ? FormState.Updating : FormState.Adding;

      Promise.all(this.fetchEntities().concat(this.configureGrid())).then(() => {
        this.gridOptions.api.setRowData(this.treatment.TreatmentItems);
      });
    });
  }

  ngOnInit() {

  }

  addOrUpdate(form: NgForm): void {
    switch (this.formState) {
      case FormState.Updating:
        this.treatment.TreatmentItems = null;       // need to remove the items from the graph to be able to edit it
        this.treatmentService.put(this.treatment).subscribe(treatment => {
          this.router.navigateByUrl(`/treatment/${treatment.Id}`);
        }, err => {

        });
        break;
      case FormState.Adding:
        this.treatmentService.post(this.treatment).subscribe(treatment => {
          this.router.navigateByUrl(`/treatment/${treatment.Id}`);
        }, err => {

        });
        break;
    }
  }

  removeTreatmentItem(id: number): void {
    const promise = new Promise<boolean>((resolve, reject) => {
      const msg = `Sunteti sigur ca doriti sa stergeti rand-ul tratament?`,
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
        const subscription = this.treatmentItemService.delete(id.toString()).subscribe(success => {
          if (success) {
            const deletedTreatmentItemIndex = this.treatment.TreatmentItems.findIndex(d => d.Id === id);

            if (deletedTreatmentItemIndex >= 0) {
              this.treatment.TreatmentItems.splice(deletedTreatmentItemIndex, 1);
              this.gridOptions.api.setRowData(this.treatment.TreatmentItems);
            }
          }
          subscription.unsubscribe();
        });
      }
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
        getRowHeight: (params) => {
          const nrOfRows = (Math.floor(params.data.Description.length / 55) + 1),
            rowHeighInPixel = nrOfRows * 25;

          return rowHeighInPixel;
        },
        columnDefs: [
          {
            headerName: 'Ziua',
            field: 'OnDay',
            width: 60,
            sort: 'asc'
          },
          {
            headerName: 'Pana',
            field: 'EndDay',
            width: 50
          },
          {
            headerName: 'Din',
            field: 'DayStep',
            width: 50
          },
          {
            headerName: 'Medicament',
            width: 250,
            sort: 'asc',
            cellRenderer: (params) =>
              `<div style='vertical-align: middle;'><button class='btn btn-sm btn-link'>${params.data.Medicament.Name}</button></div>`,
            onCellClicked: (params) => {
              const id = params.data.Id;

              this.router.navigateByUrl(`/treatment/${this.treatmentId}/item/${id}`);
            }
          },
          {
            headerName: 'Doza Medicament',
            width: 130,
            valueGetter: (params) => params.data.Dose
          },
          {
            headerName: 'Mod aplicare',
            field: 'DoseApplicationMode',
            width: 100,
            valueGetter: (params) => DoseApplicationModeEnumeration.get(params.data.Medicament.DoseApplicationMode)
          },
          {
            headerName: 'Descriere',
            field: 'Description',
            width: 350,
            cellClass: 'cell-wrap-text',
            valueGetter: (params) => params.data.Description,
            tooltip: (params) => params.data.Description
          },
          {
            headerName: '',
            field: '',
            width: 80,
            cellRenderer: (params) => this.treatment.IsDefault ? '' :
              `<div style='vertical-align: middle;'><button class='btn btn-sm btn-link'>Sterge</button></div>`,
            onCellClicked: (params) => {
              if (!this.treatment.IsDefault) {
                const id = params.data.Id;

                this.removeTreatmentItem(id);
              }
            }
          }
        ]
      };
    });
  }

  private fetchEntities(): Promise<any>[] {
    const treatmentPromise = new Promise((resolve, reject) => {
      if (this.treatmentId) {
        const treatmentSubscription = this.treatmentService.getById(this.treatmentId).subscribe(treatment => {
          this.treatment = new Treatment(treatment);
          treatmentSubscription.unsubscribe();
          resolve();
        });
      } else {
        this.treatment = new Treatment();
        resolve();
      }
    });

    return [treatmentPromise];
  }
}

enum FormState {
  Updating, Adding
}
