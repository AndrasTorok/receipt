import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Cycle, ICycle } from '../../model/cycle.model';
import { CycleService } from '../../model/cycle.service';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CycleComponent implements OnInit {
  cycles: Cycle[];
  patientId : string;
  diagnosticId: string;
  gridOptions: GridOptions;
  gridReadyPromise: Promise<any>;
  gridReady: boolean = false;

  constructor(
    private cycleService: CycleService,
    private datePipe: DatePipe  ,
    private activeRoute: ActivatedRoute,
    private router : Router  
  ) { 
    this.patientId = this.activeRoute.snapshot.params['patientId'];
    this.diagnosticId = this.activeRoute.snapshot.params['diagnosticId'];

    this.configureGrid();
  }

  ngOnInit() {
    Promise.all([this.fetchEntities(), this.gridReadyPromise]).then(() => {
      this.gridOptions.api.setRowData(this.cycles);
      this.gridReady = true;
    });
  }

  removeCycle(id: number) : void {

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
      }  ,
      columnDefs: [
        {
          headerName: 'Data inceput',
          field: "StartDate",
          width: 200,
          valueGetter: (params) => this.datePipe.transform(params.data.StartDate, 'dd/MM/yyyy')
        },
        {
          headerName: 'Tratament',
          field: "Treatment",
          width: 300,
          valueGetter: (params) => params.data.Treatment.Name
        },              
        {
          headerName: '',
          field: '',
          width: 80,
          cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Editare</button></div>`,
          onCellClicked: (params) => {  
              let id = params.data.Id;
  
              this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${this.diagnosticId}`);
          }
        },
        {
          headerName: '',
          field: '',
          width: 80,
          cellRenderer: (params) => `<div style="vertical-align: middle;"><button class="btn btn-sm btn-link">Sterge</button></div>`,
          onCellClicked: (params) => {  
              let id = params.data.Id;
  
              this.removeCycle(id);
          }
        }
      ]    
    };    
  }

  private fetchEntities(): Promise<any> {
    return new Promise((resolve, reject) => {      
        this.cycleService.getAllForDiagnosticId(this.diagnosticId ).subscribe((cycles: ICycle[])=>{
          this.cycles = cycles.map(cycle=> new Cycle(cycle));
          resolve();
        });
      
    });
  }
}
