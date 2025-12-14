import { Component, OnInit, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Guid } from '../../common/helpers';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';
import { OrderByPipe } from '../../common/orderBy.pipe';

const HeaderRows = [0, 10, 25, 50];

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
  formState: FormState;
  formLoaded = false;
  minDate: Date = new Date();

  constructor(
    private cycleService: CycleService,
    private treatmentService: TreatmentService,
    private patientService: PatientService,
    private diagnosticService: DiagnosticService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private orderByPipe: OrderByPipe,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject('Window') private window: Window
  ) {

  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.fetchView();
    });

    this.activeRoute.queryParams.subscribe(params => {
      if (params.reload) {
        this.fetchView();
      }
    });
  }

  selectedTreatmentChanged(): void {
    const selectedTratment = this.treatments.find(t => t.Id === Number(this.cycle.TreatmentId));

    if (selectedTratment) {
      this.cycle.Treatment = selectedTratment;
    }
    this.cycle.CycleItems = [];
  }

  quantityAppliedChanged(cycleItem: CycleItem) {
    const itemsToUpdate = this.cycle.CycleItems.filter(ci => ci.Medicament.Id === cycleItem.Medicament.Id &&
      ci.QuantityCalculated === cycleItem.QuantityCalculated);

    itemsToUpdate.forEach(ci => ci.QuantityApplied = cycleItem.QuantityApplied);
  }

  applyTreatment(): void {
    this.treatmentService.getById(this.cycle.TreatmentId.toString()).subscribe(treatment => {
      this.cycle.applyTreatment(treatment);
    });
  }

  saveCycleGraph(form: NgForm): void {
    this.cycle.CycleItems = this.cycle.CycleItems.map(ci => {
      ci.Medicament = ci.Cycle = ci.TreatmentItem = null;
      return ci;
    });

    this.cycle.Diagnostic = this.cycle.Treatment = null;
    this.cycle.Emitted = true;

    this.cycleService.cycleGraph(this.cycle).subscribe(cycle => {
      if (this.cycle.Id) {                                          // saving an already added graph
        form.reset();
        this.router.navigate([`/patient/${this.patientId}/diagnostic/${this.diagnosticId}/cycle/${cycle.Id}`],
          { queryParams: { reload: Guid.newGuid() } });
      } else {                                                      // adding a new graph
        this.router.navigate([`/patient/${this.patientId}/diagnostic/${this.diagnosticId}/cycle/${cycle.Id}`]);
      }
    }, err => {

    });
  }

  get canSave(): boolean {
    return this.valid && this.cycle.CycleItems && !!this.cycle.CycleItems.length;
  }

  get valid(): boolean {
    return this.cycle && this.cycle.$valid();
  }

  clone(form: NgForm): void {
    const promise = new Promise<boolean>((resolve, reject) => {
      const msg = `Sunteti sigur ca doriti sa clonati ciclul de tratament ?
        Daca da, se va crea un ciclu tratament care incepe cu ziua de azi pe care o puteti edita. `,
        responses: [string, (string) => void][] = [
          ['Da', () => {
            resolve(true);
          }],
          ['Nu', () => {
            resolve(false);
          }]
        ],
        message = new Message(msg, false, responses);

      this.messageService.reportMessage(message);
    });

    promise.then((doClone: boolean) => {
      this.messageService.removeMessage();
      if (doClone) {
        const clone = new Cycle(this.cycle, this.cycle.Gender, this.cycle.BirthDate);

        clone.CycleItems.forEach(ci => {
          ci.Medicament = ci.Cycle = ci.TreatmentItem = null;
          ci.Id = ci.CycleId = 0;
        });

        clone.Diagnostic = clone.Treatment = null;
        clone.Id = 0;
        clone.StartDate = new Date();
        clone.Emitted = false;

        this.cycleService.cycleGraph(clone).subscribe(cycle => {
          this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${this.diagnosticId}/cycle/${cycle.Id}`);
        }, err => {

        });
      }
    });
  }

  print(form: NgForm): void {
    if (this.cycle.Emitted) {
      (<any>window).print();                                                      // print it
    }
  }

  isHeaderRow(index: number): boolean {
    return HeaderRows.includes(index);
  }

  private fetchEntities(): Promise<void>[] {
    const fetchPatientPromise = new Promise<void>((resolve, reject) => {
      const patientSubscription = this.patientService.getById(this.patientId).subscribe(patient => {
        this.patient = new Patient(patient);
        patientSubscription.unsubscribe();
        resolve();
      });
    });

    const fetchCyclePromise = new Promise<void>((resolve, reject) => {
      fetchPatientPromise.then(() => {
        if (this.cycleId) {
          const cycleSubscription = this.cycleService.getById(this.cycleId).subscribe(cycle => {
            this.cycle = new Cycle(cycle, this.patient.Gender, this.patient.BirthDate);
            this.cycle.sortCycleItems();
            cycleSubscription.unsubscribe();
            resolve();
          });
        } else {
          this.cycle = new Cycle(Number(this.diagnosticId), this.patient.Gender, this.patient.BirthDate,
            this.patient.Height, this.patient.Weight);
          resolve();
        }
      });
    });

    const fetchTreatmentsPromise = new Promise<void>((resolve, reject) => {
      const subscription = this.treatmentService.getAll().subscribe(treatments => {
        this.treatments = treatments.map(t => new Treatment(t));
        subscription.unsubscribe();
        resolve();
      });
    });

    const fetchDiagnosticPromise = new Promise<void>((resolve, reject) => {
      const diagnosticSubscription = this.diagnosticService.getById(this.diagnosticId).subscribe(diagnostic => {
        this.diagnostic = new Diagnostic(diagnostic);
        diagnosticSubscription.unsubscribe();
        resolve();
      });
    });

    return [fetchCyclePromise, fetchTreatmentsPromise, fetchPatientPromise, fetchDiagnosticPromise];
  }

  private fetchView(): void {
    this.patientId = this.activeRoute.snapshot.params['patientId'];
    this.diagnosticId = this.activeRoute.snapshot.params['diagnosticId'];
    this.cycleId = this.activeRoute.snapshot.params['cycleId'];
    this.formState = this.cycleId ? FormState.Updating : FormState.Adding;

    Promise.all(this.fetchEntities()).then(() => {
      this.formLoaded = true;
    });
  }
}

enum FormState {
  Updating, Adding
}
