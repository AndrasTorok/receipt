import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions, GridApi } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { TreatmentService } from '../../model/treatment.service';
import { Treatment } from '../../model/treatment.model';

@Component({
  selector: 'app-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TreatmentComponent implements OnInit {
  treatments: Treatment[];
  selectedTreatment: Treatment;
  gridOptions: GridOptions;  
  gridReadyPromise: Promise<any>;  
  gridReady: boolean = false;
  private _quickFilterText: string = '';

  constructor(
    private treatmentService: TreatmentService,
    private activeRoute : ActivatedRoute,
    private router: Router
  ) {
       
    this.configureGrid();
  }

  ngOnInit() {
    Promise.all([this.fetchEntities(), this.gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.treatments);      
    });
  }

  removeTreatment(id: number) : void {
    let subscription = this.treatmentService.delete(id.toString()).subscribe(success=>{
      if(success) {
          let deletedTreatmentIndex = this.treatments.findIndex(d=> d.Id == id);

          if(deletedTreatmentIndex) {
            this.treatments.splice(deletedTreatmentIndex, 1);
            this.gridOptions.api.setRowData(this.treatments);
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
          this.gridReady = true;
          resolve();
        });
      },
      onSelectionChanged: () => {
        
      },
      columnDefs: [
        {
          headerName: 'Tratament',
          field: "Name",
          width: 300
        },
        {
          headerName: '',
          field: '',
          width: 80,
          cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Editare</button></div>`,
          onCellClicked: (params) => {  
              let id = params.data.Id;
  
              this.router.navigateByUrl(`/treatment/${id}`);
          }
        },
        {
          headerName: '',
          field: '',
          width: 80,
          cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Sterge</button></div>`,
          onCellClicked: (params) => {  
              let id = params.data.Id;
  
              this.removeTreatment(id);
          }
        }
      ]
    };        
  }

  private fetchEntities(): Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.treatmentService.fetchEntityAndUnsubscribe((entities) => this.treatments = entities.map(p => new Treatment(p)))
      ]).then(() => {
        resolve();
      });
    });
  }  
}
