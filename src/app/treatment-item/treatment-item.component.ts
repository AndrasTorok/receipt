import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { TreatmentItem } from '../../model/treatment-item.model';
import { TreatmentItemService } from '../../model/treatment-item.service';
import { Medicament } from '../../model/medicament.model';
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
  medicaments : Medicament[];
  formState: FormState;

  constructor(
    private treatmentItemService: TreatmentItemService,
    private medicamentService: MedicamentService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.treatmentId = this.activeRoute.snapshot.params['treatmentId'];
    this.treatmentItemId = this.activeRoute.snapshot.params['treatmentItemId'];
    this.formState = this.treatmentId ? FormState.Updating: FormState.Adding;
  }

  ngOnInit() {    
    if (this.treatmentItemId) {
      let treatmentItemSubscription = this.treatmentItemService.getById(this.treatmentItemId).subscribe(treatmentItem => {
        this.treatmentItem = new TreatmentItem(treatmentItem);        
        treatmentItemSubscription.unsubscribe();
      });
    } else this.treatmentItem = new TreatmentItem(Number(this.treatmentId));

    this.medicamentService.fetchEntityAndUnsubscribe((entities) => this.medicaments = entities.map(p => new Medicament(p)));    
  }

}

enum FormState {
  Updating, Adding
}
