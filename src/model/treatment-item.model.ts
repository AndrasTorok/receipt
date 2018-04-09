import { Treatment } from './treatment.model';
import { Medicament } from './medicament.model';

export class TreatmentItem {
    Id: number;
    TreatmentId: number;
    Treatment: Treatment;
    MedicamentId: number;
    Medicament: Medicament;
    OnDay: number;

    constructor(treatmentItem: ITreatmentItem) {
        if(!treatmentItem) {
            treatmentItem = <ITreatmentItem> {
                Id: 0,
                Treatment : new Treatment(),
                Medicament: new Medicament(),
                OnDay: 0
            };
        }

        for(var prop in treatmentItem) {
            this[prop]  = treatmentItem[prop];
        }
    }
}

export interface ITreatmentItem {
    Id: number;
    TreatmentId?: number;
    Treatment: Treatment;
    MedicamentId?: number;
    Medicament: Medicament;
    OnDay: number;
}