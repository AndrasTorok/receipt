import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { Diagnostic } from '../../model/diagnostic.model';
import { DiagnosticService } from '../../model/diagnostic.service';
import { Patient, Gender } from '../../model/patient.model';
import { PatientService } from '../../model/patient.service';

@Component({
  selector: 'app-diagnostic-detail',
  templateUrl: './diagnostic-detail.component.html',
  styleUrls: ['./diagnostic-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagnosticDetailComponent implements OnInit {
  diagnostic: Diagnostic;
  patient: Patient;
  patientId: string;
  id: string;
  formState: FormState;
  viewLoaded: boolean = false;  

  constructor(
    private diagnosticService: DiagnosticService,
    private patientService: PatientService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {    
    activeRoute.params.subscribe(params => {
      this.patientId = activeRoute.snapshot.params['patientId'];
      this.id = activeRoute.snapshot.params['diagnosticId'];
      this.formState = this.id ? FormState.Updating : FormState.Adding;

      Promise.all(this.fetchEntities()).then(()=>{
        this.viewLoaded = true;
      });
    });
  }

  ngOnInit() {
    
  }

  addOrUpdate(): void {
    switch (this.formState) {
      case FormState.Updating:
        this.diagnosticService.put(this.diagnostic).subscribe(diagnostic => {
          this.reloadView(diagnostic);
        }, err => {

        });
        break;
      case FormState.Adding:
        this.diagnosticService.post(this.diagnostic).subscribe(diagnostic => {
          this.reloadView(diagnostic);
        }, err => {

        });
        break;
    }
  }

  changeDate(event) {
    this.diagnostic.Date = new Date(event);
  }

  private reloadView(diagnostic: Diagnostic) {
    this.router.navigateByUrl(`/patient/${this.patientId}/diagnostic/${diagnostic.Id}`);
  }

  private goBack(): void {
    this.router.navigateByUrl(`/patient/${this.patientId}`);
  }

  private fetchEntities(): Promise<any>[] {
    let fetchDiagnosticPromise = new Promise((resolve, reject) => {
      if (this.id) {
        let diagnosticSubscription = this.diagnosticService.getById(this.id).subscribe(diagnostic => {
          this.diagnostic = new Diagnostic(diagnostic);
          diagnosticSubscription.unsubscribe();
          resolve();
        });
      } else {
        this.diagnostic = new Diagnostic(Number(this.patientId));
        resolve();
      }
    });

    let fetchPatientPromise = new Promise((resolve, reject) => {
      let patientSubscription = this.patientService.getById(this.patientId).subscribe(patient => {
        this.patient = new Patient(patient);
        patientSubscription.unsubscribe();
        resolve();
      });
    });

    return [fetchDiagnosticPromise, fetchPatientPromise];
  }
}

enum FormState {
  Updating, Adding
}
