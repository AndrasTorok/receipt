import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions, GridApi } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { TreatmentService } from '../../model/treatment.service';
import { Treatment } from '../../model/treatment.model';

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
  gridReady: boolean = false;
  private formState: FormState;

  constructor(
    private treatmentService: TreatmentService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.treatmentId = this.activeRoute.snapshot.params['treatmentId'];
    this.formState = this.treatmentId ? FormState.Updating: FormState.Adding;
    
    this.configureGrid();
  }

  ngOnInit() {
    if (this.treatmentId) {
      let treatmentSubscription = this.treatmentService.getById(this.treatmentId).subscribe(treatment => {
        this.treatment = new Treatment(treatment);
        this.gridOptions.api.setRowData(this.treatment.TreatmentItems);
        treatmentSubscription.unsubscribe();
      });
    } else this.treatment = new Treatment();         
  }

  addOrUpdate(form: NgForm): void {
    switch (this.formState) {
      case FormState.Updating:
        this.treatment.TreatmentItems = null;       //need to remove the items from the graph to be able to edit it
        this.treatmentService.put(this.treatment).subscribe(treatment => {
          //this.treatment = new Treatment(treatment);    
          this.router.navigateByUrl(`/treatment/${this.treatment.Id}`);      
        }, err => {

        });
        break;
      case FormState.Adding:
        this.treatmentService.post(this.treatment).subscribe(treatment => {
          //this.treatment = new Treatment(treatment);
          this.router.navigateByUrl(`/treatment/${this.treatment.Id}`);
        }, err => {

        });
        break;
    }
  }  

  removeTreatmentItem(id: number): void {

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
      onGridReady: () => {
        this.gridReadyPromise = new Promise((resolve, reject) => {
          resolve();
        });
      },
      onSelectionChanged: () => {
        
      },
      columnDefs: [
        {
          headerName: 'Medicament',
          width: 200,
          valueGetter: (params) => params.data.Medicament.Name
        },
        {
          headerName: 'Doza Medicament',
          width: 150,
          valueGetter: (params) => params.data.Medicament.Dose
        },
        {
          headerName: 'Ziua',
          field: "OnDay",
          width: 100
        }  ,
        {
          headerName: '',
          field: '',
          width: 80,
          cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Editare</button></div>`,
          onCellClicked: (params) => {  
              let id = params.data.Id;
  
              this.router.navigateByUrl(`/treatment/${this.treatmentId}/item/${id}`);
          }
        },
        {
          headerName: '',
          field: '',
          width: 80,
          cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Sterge</button></div>`,
          onCellClicked: (params) => {  
              let id = params.data.Id;
  
              this.removeTreatmentItem(id);
          }
        }    
      ]
    };    
  }
}

enum FormState {
  Updating, Adding
}
