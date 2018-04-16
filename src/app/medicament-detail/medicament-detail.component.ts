import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { Medicament, DoseApplicationModeEnumeration } from '../../model/medicament.model';
import { MedicamentService } from '../../model/medicament.service';

@Component({
  selector: 'app-medicament-detail',
  templateUrl: './medicament-detail.component.html',
  styleUrls: ['./medicament-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MedicamentDetailComponent implements OnInit {
  medicament: Medicament;
  medicamentId: string;
  doseApplicationModeEnumeration = DoseApplicationModeEnumeration;
  private formState: FormState;

  constructor(
    private medicamentService: MedicamentService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.medicamentId = this.activeRoute.snapshot.params['medicamentId'];
    this.formState = this.medicamentId ? FormState.Updating: FormState.Adding;
  }

  ngOnInit() {
    if (this.medicamentId) {
      let subscription = this.medicamentService.getById(this.medicamentId).subscribe(medicament => {
        this.medicament = new Medicament(medicament);        
        subscription.unsubscribe();
      });
    } else this.medicament = new Medicament();
  }

  addOrUpdate(form: NgForm): void {
    switch (this.formState) {
      case FormState.Updating:        
        this.medicamentService.put(this.medicament).subscribe(medicament => {
          this.router.navigateByUrl(`/medicament`);          
        }, err => {

        });
        break;
      case FormState.Adding:
        this.medicamentService.post(this.medicament).subscribe(patient => {
          this.router.navigateByUrl(`/medicament`);
        }, err => {

        });
        break;
    }
  }

}

enum FormState {
  Updating, Adding
}
