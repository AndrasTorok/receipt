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
  id: string;
  formState: FormState;

  constructor(
    private diagnosticService: DiagnosticService,
    private activeRoute: ActivatedRoute
  ) { 
    this.id = this.activeRoute.snapshot.params['id'];
    this.formState = this.id ? FormState.Updating : FormState.Adding;
  }

  ngOnInit() {
    if (this.id) {
      let diagnosticSubscription = this.diagnosticService.getById(this.id).subscribe(diagnostic => {
        this.diagnostic = new Diagnostic(diagnostic);
        diagnosticSubscription.unsubscribe();
      });
    } else this.diagnostic = new Diagnostic(0); 
  }

}

enum FormState {
  Updating, Adding
}
