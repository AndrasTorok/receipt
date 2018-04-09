import { Treatment } from './treatment.model';
import { Medicament } from './medicament.model';

export class TreatmentItem {
    Id: number;
    TreatmentId: number;
    Treatment: Treatment;
    MedicamentId: number;
    Medicament: Medicament;
    OnDay: number;

    constructor(treatmentItemOrId: ITreatmentItem | number) {
        let treatmentItem : ITreatmentItem;

        if(Number.isInteger(<number>treatmentItemOrId)) {
            treatmentItem = <ITreatmentItem> {
                Id: 0,
                TreatmentId: <number> treatmentItemOrId,               
                MedicamentId: 0,
                OnDay: 0
            };
        } else treatmentItem = <ITreatmentItem> treatmentItemOrId;

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