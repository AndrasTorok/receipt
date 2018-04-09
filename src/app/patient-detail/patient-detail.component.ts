import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Patient, Gender } from '../../model/patient.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { ReceiptDocument } from '../pdf-helpers/receiptDocument';
import { PatientService } from '../../model/patient.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientDetailComponent implements OnInit {
  private formSubmitted: boolean = false;
  private patient: Patient;
  private id: string;
  private formState: FormState;

  constructor(
    private receiptDocument: ReceiptDocument,
    private patientService: PatientService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.activeRoute.snapshot.params['patientId'];
    this.formState = this.id ? FormState.Updating : FormState.Adding;
  }

  ngOnInit() {
    if (this.id) {
      let patientSubscription = this.patientService.getById(this.id).subscribe(patient => {
        this.patient = new Patient(patient);
        patientSubscription.unsubscribe();
      });
    } else this.patient = new Patient();    
  }

  previewReceipt(form: NgForm): void {    
    this.receiptDocument.preview({ patient: this.patient });
  }

  addOrUpdate(): void {
    switch (this.formState) {
      case FormState.Updating:
        this.patientService.put(this.patient).subscribe(patient => {
          this.patient = new Patient(patient);
        }, err => {

        });
        break;
      case FormState.Adding:
        this.patientService.post(this.patient).subscribe(patient => {
          this.patient = new Patient(patient);
          this.router.navigateByUrl(`/patient/${this.patient.Id}`);
        }, err => {

        });
        break;
    }
  }

  cnpChanged(): void {
    if (this.patient) this.patient.extractCNP();
  }  
}

enum FormState {
  Updating, Adding
}
