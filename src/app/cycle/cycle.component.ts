import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Cycle, ICycle } from '../../model/cycle.model';
import { CycleService } from '../../model/cycle.service';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CycleComponent implements OnInit {
  cycles: Cycle[];
  patientId: string;
  diagnosticId: string;
  gridOptions: GridOptions;  
  gridReady: boolean = false;

  constructor(
    private cycleService: CycleService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    let gridReadyPromise: Promise<any> = this.configureGrid();

    this.activeRoute.params.subscribe(params => {
      this.patientId = this.activeRoute.snapshot.params['patientId'];
      this.diagnosticId = this.activeRoute.snapshot.params['diagnosticId'];

      Promise.all([this.fetchEntities(), gridReadyPromise]).then(() => {
        this.gridOptions.api.setRowData(this.cycles);
        this.gridReady = true;
      });
    });    
  }

  ngOnInit() {

  }

  removeCycle(id: number): void {
    let promise = new Promise<boolean>((resolve, reject) => {
      let msg = `Sunteti sigur ca doriti sa stergeti tratament pacient?`,
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
      let subscription = this.cycleService.delete(id.toString()).subscribe(success => {
        if (success) {
          let deletedCycleIndex = this.cycles.findIndex(d => d.Id == id);

          if (deletedCycleIndex >= 0) {
            this.cycles.splice(deletedCycleIndex, 1);
            this.gridOptions.api.setRowData(this.cycles);
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
        columnDefs: [
          {
            headerName: 'Data inceput',
            field: "StartDate",
            width: 100,
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

              this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${this.diagnosticId}/cycle/${id}`);
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
    });
  }

  private fetchEntities(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.diagnosticId) {
        this.cycleService.getAllForDiagnosticId(this.diagnosticId).subscribe((cycles: ICycle[]) => {
          this.cycles = cycles.map(cycle => new Cycle(cycle, <any>0, new Date()));
          resolve();
        });
      } else resolve();
    });
  }
}
