import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  formState: FormState;

  constructor(
    private medicamentService: MedicamentService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.medicamentId = this.activeRoute.snapshot.params['medicamentId'];
    this.formState = this.medicamentId ? FormState.Updating : FormState.Adding;

    this.fetchEntities();
  }

  ngOnInit() {

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

  private fetchEntities(): Promise<any>[] {
    const medicamentPromise = new Promise((resolve, reject) => {
      if (this.medicamentId) {
        const subscription = this.medicamentService.getById(this.medicamentId).subscribe(medicament => {
          this.medicament = new Medicament(medicament);
          subscription.unsubscribe();
          resolve();
        });
      } else {
        this.medicament = new Medicament();
        resolve();
      }
    });

    return [medicamentPromise];
  }
}

enum FormState {
  Updating, Adding
}
