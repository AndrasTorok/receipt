import { Diagnostic } from './diagnostic.model';
import { Treatment } from './treatment.model';
import { TreatmentItem } from './treatment-item.model';
import { Medicament } from './medicament.model';
import { Cycle } from './cycle.model';

export class CycleItem implements ICycleItem {
    Id: number;
    CycleId: number;
    Cycle: Cycle;
    TreatmentId: number;
    Treatment: Treatment;
    TreatmentItemId : number;
    TreatmentItem: TreatmentItem;
    MedicamentId: number;
    Medicament: Medicament;
    OnDay: number;
    QuantityCalculated: number;
    QuantityApplied: number;

    constructor(cycleItemOrCycleId : ICycleItem | number) {
        let cycleItem: ICycleItem;

        if (Number.isInteger(<number>cycleItemOrCycleId)) {
            cycleItem = <ICycleItem>{
                Id: 0,
                CycleId: <number>cycleItemOrCycleId,                
                TreatmentId: 0,
                Treatment: null,
                TreatmentItemId: 0,
                TreatmentItem: null,
                MedicamentId: 0,
                Medicament: null
            };
        } else cycleItem = <ICycleItem>cycleItemOrCycleId;

        for (var prop in cycleItem) {
            this[prop] = cycleItem[prop];
        }        
    }
}

export interface ICycleItem{
    Id: number;
    CycleId: number;
    Cycle: Cycle;
    TreatmentId: number;
    Treatment: Treatment;
    TreatmentItemId : number;
    TreatmentItem: TreatmentItem;
    MedicamentId: number;
    Medicament: Medicament;
    OnDay: number;
    QuantityCalculated: number;
    QuantityApplied: number;
}