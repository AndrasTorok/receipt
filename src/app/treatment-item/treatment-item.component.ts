import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TreatmentItem } from '../../model/treatment-item.model';
import { TreatmentItemService } from '../../model/treatment-item.service';
import { Medicament, DoseApplicationModeEnumeration } from '../../model/medicament.model';
import { MedicamentService } from '../../model/medicament.service';

@Component({
  selector: 'app-treatment-item',
  templateUrl: './treatment-item.component.html',
  styleUrls: ['./treatment-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TreatmentItemComponent implements OnInit {
  treatmentItem: TreatmentItem;
  treatmentId: string;
  treatmentItemId: string;
  medicaments: Medicament[];
  formState: FormState;
  doseApplicationModeEnumeration = DoseApplicationModeEnumeration;

  constructor(
    private treatmentItemService: TreatmentItemService,
    private medicamentService: MedicamentService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.treatmentId = this.activeRoute.snapshot.params['treatmentId'];
    this.treatmentItemId = this.activeRoute.snapshot.params['treatmentItemId'];
    this.formState = this.treatmentItemId ? FormState.Updating : FormState.Adding;

    this.fetchEntities();
  }

  ngOnInit() {

  }

  get selectedMedicament(): Medicament {
    return this.medicaments && this.treatmentItem && this.treatmentItem.MedicamentId ?
      this.medicaments.find(medicament => medicament.Id === this.treatmentItem.MedicamentId) : null;
  }

  get applicationMode(): string {
    const selectedMedicament = this.selectedMedicament,
      applicationMode =  selectedMedicament ?
        this.doseApplicationModeEnumeration.keyValuePairs.find(kvp => kvp.key === selectedMedicament.DoseApplicationMode).value : '';

      return applicationMode;
  }

  addOrUpdate(form: NgForm): void {
    switch (this.formState) {
      case FormState.Updating:
        this.treatmentItemService.put(this.treatmentItem).subscribe(treatmentItem => {
          this.router.navigateByUrl(`/treatment/${this.treatmentId}`);
        }, err => {

        });
        break;
      case FormState.Adding:
        this.treatmentItemService.post(this.treatmentItem).subscribe(treatmentItem => {
          this.router.navigateByUrl(`/treatment/${this.treatmentId}`);
        }, err => {

        });
        break;
    }
  }

  private fetchEntities(): Promise<any>[] {
    const fetchTreatmentItemPromise = new Promise<void>((resolve, reject) => {
      if (this.treatmentItemId) {
        const treatmentItemSubscription = this.treatmentItemService.getById(this.treatmentItemId).subscribe(treatmentItem => {
          this.treatmentItem = new TreatmentItem(treatmentItem);
          treatmentItemSubscription.unsubscribe();
          resolve();
        });
      } else {
        this.treatmentItem = new TreatmentItem(Number(this.treatmentId));
        resolve();
      }
    });

    const fetchMedicamentPromise =
      this.medicamentService.fetchEntityAndUnsubscribe((entities) => this.medicaments = entities.map(p => new Medicament(p)));

    return [fetchTreatmentItemPromise, fetchMedicamentPromise];
  }
}

enum FormState {
  Updating, Adding
}
