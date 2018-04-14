import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from "ag-grid/main";
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { Cycle, ICycle } from '../../model/cycle.model';
import { CycleService } from '../../model/cycle.service';
import { CycleItem, ICycleItem } from '../../model/cycle-item.model';
import { Treatment } from '../../model/treatment.model';
import { TreatmentService } from '../../model/treatment.service';
import { Patient, Gender } from '../../model/patient.model';
import { PatientService } from '../../model/patient.service';
import { TreatmentItem, ITreatmentItem } from '../../model/treatment-item.model';
import { Diagnostic } from '../../model/diagnostic.model';
import { DiagnosticService } from '../../model/diagnostic.service';
import { Medicament } from '../../model/medicament.model';

@Component({
  selector: 'app-cycle-detail',
  templateUrl: './cycle-detail.component.html',
  styleUrls: ['./cycle-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CycleDetailComponent implements OnInit {
  cycle: Cycle;
  patient: Patient;
  diagnostic: Diagnostic;
  patientId: string;
  diagnosticId: string;
  cycleId: string;
  treatments: Treatment[];
  selectedTreatment: Treatment;
  formState: FormState;
  formLoaded: boolean = false;

  constructor(
    private cycleService: CycleService,
    private treatmentService: TreatmentService,
    private patientService: PatientService,
    private diagnosticService: DiagnosticService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.patientId = activeRoute.snapshot.params['patientId'];
    this.diagnosticId = activeRoute.snapshot.params['diagnosticId'];
    this.cycleId = activeRoute.snapshot.params['cycleId'];
    this.formState = this.cycleId ? FormState.Updating : FormState.Adding;
  }

  ngOnInit() {
    Promise.all([this.fetchEntities()]).then(() => {
      this.formLoaded = true;
    });
  }

  applyTreatment(): void {
    this.treatmentService.getById(this.cycle.TreatmentId.toString()).subscribe(treatment => {
      let cycleItems = [];

      this.selectedTreatment = new Treatment(treatment);

      if (treatment.TreatmentItems && treatment.TreatmentItems.length) {
        cycleItems = treatment.TreatmentItems.map(ti => {
          let cycleItem = new CycleItem(<ICycleItem>{
            CycleId: this.cycle.Id,
            TreatmentItemId: ti.Id,
            MedicamentId: ti.MedicamentId,
            Medicament: new Medicament(ti.Medicament),
            OnDay: ti.OnDay,
            QuantityCalculated: 0,
            QuantityApplied: 0
          });

          cycleItem.setCalculatedQuantity(this.patient);

          return cycleItem;
        });
      }

      this.cycle.CycleItems = cycleItems;
    });
  }

  saveCycleGraph(): void {    
    this.cycleService.cycleGraph(this.cycle).subscribe(cycle => {
      this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${this.diagnosticId}`);
    }, err => {

    });
  }

  removeItem(index: number) : void {
    this.cycle.CycleItems.splice(index, 1);
  }

  get valid() : boolean {
    return this.cycle && this.cycle.$valid();
  }

  get invalidProperties() : string {
    return this.cycle ? this.cycle.$invalidProperties().join(', ') : ''['']'';
  }

  private fetchEntities(): Promise<any>[] {
    let fetchCycleEntityPromise = new Promise((resolve, reject) => {
      if (this.cycleId) {
        let cycleSubscription = this.cycleService.getById(this.cycleId).subscribe(cycle => {
          this.cycle = new Cycle(cycle);
          cycleSubscription.unsubscribe();
          resolve();
        });
      } else {
        this.cycle = new Cycle(Number(this.diagnosticId));
        resolve();
      }
    });

    let fetchTreatmentsPromise = this.treatmentService.fetchEntityAndUnsubscribe(entities => this.treatments = entities.map(ent => new Treatment(ent)));

    let fetchPatientPromise = new Promise((resolve, reject) => {
      let patientSubscription = this.patientService.getById(this.patientId).subscribe(patient => {
        this.patient = new Patient(patient);
        patientSubscription.unsubscribe();
      });
    });

    let fetchDiagnosticPromise = new Promise((resolve, reject) => {
      let diagnosticSubscription = this.diagnosticService.getById(this.diagnosticId).subscribe(diagnostic => {
        this.diagnostic = new Diagnostic(diagnostic);
        diagnosticSubscription.unsubscribe();
      });
    });

    return [fetchCycleEntityPromise, fetchTreatmentsPromise, fetchPatientPromise, fetchDiagnosticPromise];
  }
}

enum FormState {
  Updating, Adding
}
