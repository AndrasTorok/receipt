import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions, GridApi } from "ag-grid/main";
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
  itemsGridOptions: GridOptions;
  gridReadyPromise: Promise<any>;
  itemsGridReadyPromise: Promise<any>;
  gridReady: boolean = false;
  private _quickFilterText: string = '';

  constructor(
    private treatmentService: TreatmentService
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
        let selectedTreatment = this.gridOptions.api.getSelectedRows();

        this.selectedTreatment = selectedTreatment && selectedTreatment.length ? selectedTreatment[0] : null;

        let treatmentSubscription = this.treatmentService.getById(this.selectedTreatment.Id.toString()).subscribe(treatment => {
          this.itemsGridOptions.api.setRowData(treatment.TreatmentItems);
          treatmentSubscription.unsubscribe();
        });
      }
    };

    this.itemsGridOptions = <GridOptions>{
      enableFilter: true,
      enableSorting: true,
      sortingOrder: ['asc', 'desc', null],
      pagination: true,
      paginationAutoPageSize: true,
      rowSelection: 'single',
      rowHeight: 30,    
      onGridReady: () => {
        this.itemsGridReadyPromise = new Promise((resolve, reject) => {
          resolve();
        });
      },
      onSelectionChanged: () => {
        
      }
    };

    this.setGridColums();
  }

  ngOnInit() {
    Promise.all([this.fetchEntities(), this.gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.treatments);
      this.selectFirstRow(this.gridOptions.api);
    });
  }

  private setGridColums(): void {
    this.gridOptions.columnDefs = [
      {
        headerName: 'Tratament',
        field: "Name",
        width: 300
      }
    ];
    this.itemsGridOptions.columnDefs = [
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
      }
    ];
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

  private selectFirstRow(gridAdpi: GridApi): void {
    let first: boolean = true;
    gridAdpi.forEachNode(node => {
      if (first) node.setSelected(true);
      first = false;
    });
  }
}
