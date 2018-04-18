import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Patient, Gender } from '../../model/patient.model';
import { Diagnostic, IDiagnostic } from '../../model/diagnostic.model';

@Component({
  selector: 'app-patient-detail-display',
  templateUrl: './patient-detail-display.component.html',
  styleUrls: ['./patient-detail-display.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientDetailDisplayComponent implements OnInit {

  @Input()
  patient: Patient;

  @Input()
  diagnostic: Diagnostic;

  constructor() { }

  ngOnInit() {
  }

}
