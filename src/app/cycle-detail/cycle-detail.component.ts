import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
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
import { Medicament, DoseApplicationMode } from '../../model/medicament.model';
import { Calculation } from '../../common/helpers';

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
    private router: Router,
    @Inject('Window') private window: Window
  ) {

  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.patientId = this.activeRoute.snapshot.params['patientId'];
      this.diagnosticId = this.activeRoute.snapshot.params['diagnosticId'];
      this.cycleId = this.activeRoute.snapshot.params['cycleId'];
      this.formState = this.cycleId ? FormState.Updating : FormState.Adding;

      Promise.all(this.fetchEntities()).then(() => {
        this.formLoaded = true;
      });
    });
  }

  applyTreatment(): void {
    let s = 1;
    this.treatmentService.getById(this.cycle.TreatmentId.toString()).subscribe(treatment => {
      let cycleItems = [];

      this.selectedTreatment = new Treatment(treatment);

      if (treatment.TreatmentItems && treatment.TreatmentItems.length) {
        cycleItems = treatment.TreatmentItems.map(ti => {
          let cycleItem = new CycleItem(<ICycleItem>{
            CycleId: this.cycle.Id,
            Cycle: this.cycle,
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

      this.cycle.CycleItems = cycleItems.sort((a, b) => {
        let onDayDifference = a.OnDay - b.OnDay;
        if (onDayDifference) return onDayDifference;
        let medicamentNameDifference = a.Medicament.Name > b.Medicament.Name ? 1 : -1;

        return medicamentNameDifference;
      });
    });
  }

  saveCycleGraph(): void {
    this.cycle.CycleItems = this.cycle.CycleItems.map(ci => {
      ci.Cycle = null;
      return ci;
    });

    this.cycleService.cycleGraph(this.cycle).subscribe(cycle => {
      this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${this.diagnosticId}`);
    }, err => {

    });
  }

  removeItem(index: number): void {
    this.cycle.CycleItems.splice(index, 1);
  }

  get valid(): boolean {
    return this.cycle && this.cycle.$valid();
  }

  get invalidProperties(): string {
    return this.cycle ? this.cycle.$invalidProperties().join(', ') : '';
  }

  get isSerumCreatNeeded(): boolean {
    let isNeeded: boolean = false;

    if (this.cycle && this.cycle.TreatmentId && this.treatments) {
      let selectedTreatment = this.treatments.find(t => t.Id == this.cycle.TreatmentId);
      if (!selectedTreatment) throw new Error(`Selected treatment does not exists!`);

      isNeeded = selectedTreatment.IsSerumCreatNeeded;
    }

    return isNeeded;
  }

  clone(): void {
    let clone = JSON.parse(JSON.stringify(this.cycle));

    clone.CycleItems.forEach(ci => {
      ci.Medicament = ci.Cycle = ci.TreatmentItem = null;
      ci.Id = ci.CycleId = 0;
    });

    clone.Diagnostic = clone.Treatment = null;
    clone.Id = 0;

    this.cycleService.cycleGraph(clone).subscribe(cycle => {
      this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${this.diagnosticId}/cycle/${cycle.Id}`);
    }, err => {

    });
  }

  get canClone(): boolean {
    return this.valid && !!this.cycle.Id && this.cycle.CycleItems && !this.cycle.CycleItems.some(ci => !ci.Id);
  }

  print(): void {
    (<any>window).print();
  }

  private fetchEntities(): Promise<any>[] {
    let fetchPatientPromise = new Promise((resolve, reject) => {
      let patientSubscription = this.patientService.getById(this.patientId).subscribe(patient => {
        this.patient = new Patient(patient);
        patientSubscription.unsubscribe();
        resolve();
      });
    });

    let fetchCycleEntityPromise = new Promise((resolve, reject) => {
      fetchPatientPromise.then(() => {
        if (this.cycleId) {
          let cycleSubscription = this.cycleService.getById(this.cycleId).subscribe(cycle => {
            this.cycle = new Cycle(cycle, this.patient.Gender, this.patient.BirthDate);
            cycleSubscription.unsubscribe();
            resolve();
          });
        } else {
          this.cycle = new Cycle(Number(this.diagnosticId), this.patient.Gender, this.patient.BirthDate, this.patient.Height, this.patient.Weight);
          resolve();
        }
      });
    });

    let fetchTreatmentsPromise = new Promise((resolve, reject) => {
      let subscription = this.treatmentService.getAll().subscribe(treatments => {
        this.treatments = treatments.map(t => new Treatment(t));
        subscription.unsubscribe();
        resolve();
      });
    });

    let fetchDiagnosticPromise = new Promise((resolve, reject) => {
      let diagnosticSubscription = this.diagnosticService.getById(this.diagnosticId).subscribe(diagnostic => {
        this.diagnostic = new Diagnostic(diagnostic);
        diagnosticSubscription.unsubscribe();
        resolve();
      });
    });

    return [fetchCycleEntityPromise, fetchTreatmentsPromise, fetchPatientPromise, fetchDiagnosticPromise];
  }
}

enum FormState {
  Updating, Adding
}
