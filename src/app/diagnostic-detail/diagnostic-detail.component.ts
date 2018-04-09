import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { Diagnostic } from '../../model/diagnostic.model';
import { DiagnosticService } from '../../model/diagnostic.service';

@Component({
  selector: 'app-diagnostic-detail',
  templateUrl: './diagnostic-detail.component.html',
  styleUrls: ['./diagnostic-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagnosticDetailComponent implements OnInit {
  diagnostic: Diagnostic;
  patientId: string;
  id: string;
  formState: FormState;

  constructor(
    private diagnosticService: DiagnosticService,
    activeRoute: ActivatedRoute    ,
    private router: Router
  ) { 
    this.patientId = activeRoute.snapshot.params['patientId'];
    this.id = activeRoute.snapshot.params['diagnosticId'];
    this.formState = this.id ? FormState.Updating : FormState.Adding;
  }

  ngOnInit() {
    if (this.id) {
      let diagnosticSubscription = this.diagnosticService.getById(this.id).subscribe(diagnostic => {
        this.diagnostic = new Diagnostic(diagnostic);
        diagnosticSubscription.unsubscribe();
      });
    } else this.diagnostic = new Diagnostic(Number(this.patientId)); 
  }  

  addOrUpdate(): void {
    switch (this.formState) {
      case FormState.Updating:
        this.diagnosticService.put(this.diagnostic).subscribe(diagnostic => {          
          this.goBack();
        }, err => {

        });
        break;
      case FormState.Adding:
        this.diagnosticService.post(this.diagnostic).subscribe(diagnostic => {
          this.goBack();
        }, err => {

        });
        break;
    }
  }

  private goBack(): void {
    this.router.navigateByUrl(`/patient/${this.patientId}`);
  }
}

enum FormState {
  Updating, Adding
}
