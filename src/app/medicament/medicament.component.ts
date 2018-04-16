import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions, GridApi } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { Medicament, DoseApplicationModeEnumeration } from '../../model/medicament.model';
import { MedicamentService } from '../../model/medicament.service';

@Component({
  selector: 'app-medicament',
  templateUrl: './medicament.component.html',
  styleUrls: ['./medicament.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MedicamentComponent implements OnInit {
  medicaments: Medicament[];
  selectedMedicament: Medicament;
  gridOptions: GridOptions;  
  gridReadyPromise: Promise<any>;  
  gridReady: boolean = false;
  private _quickFilterText: string = '';

  constructor(
    private medicamentService: MedicamentService,
    private activeRoute : ActivatedRoute,
    private router: Router
  ) { 
    this.configureGrid();
  }

  ngOnInit() {
    Promise.all([this.fetchEntities(), this.gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.medicaments);      
    });
  }

  removeMedicament(id: number): void {
    let subscription = this.medicamentService.delete(id.toString()).subscribe(success=>{
      if(success) {
          let deletedMedicamentIndex = this.medicaments.findIndex(d=> d.Id == id);

          if(deletedMedicamentIndex >=0 ) {
            this.medicaments.splice(deletedMedicamentIndex, 1);
            this.gridOptions.api.setRowData(this.medicaments);
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
          headerName: 'Medicament',
          field: "Name",
          width: 300
        },
        {
          headerName: 'Doza',
          field: "Dose",
          width: 100
        },
        {
          headerName: 'Mod aplicare',
          field: "DoseApplicationMode",
          width: 100,
          valueGetter: (params)=> DoseApplicationModeEnumeration.get(params.data.DoseApplicationMode)
        },
        {
          headerName: 'Descriere',
          field: "Description",
          width: 350          ,
          tooltip: (params)=> params.data.Description
        },
        {
          headerName: '',
          field: '',
          width: 80,
          cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Editare</button></div>`,
          onCellClicked: (params) => {  
              let id = params.data.Id;
  
              this.router.navigateByUrl(`/medicament/${id}`);
          }
        },
        {
          headerName: '',
          field: '',
          width: 80,
          cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Sterge</button></div>`,
          onCellClicked: (params) => {  
              let id = params.data.Id;
  
              this.removeMedicament(id);
          }
        }
      ]
    };        
  }

  private fetchEntities(): Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.medicamentService.fetchEntityAndUnsubscribe((entities) => this.medicaments = entities.map(p => new Medicament(p)))
      ]).then(() => {
        resolve();
      });
    });
  }
}
