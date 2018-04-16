import { TreatmentItem } from './treatment-item.model';

export class Treatment {
    Id: number;
    Name: string;
    TreatmentItems: TreatmentItem[];
    IsSerumCreatNeeded: boolean;

    constructor(treatment?: ITreatment) {
        if (!treatment) {
            treatment = <ITreatment>{
                Id: 0,
                Name: '',
                IsSerumCreatNeeded: false,
                TreatmentItems: []
            };
        }

        for (var prop in treatment) {
            this[prop] = treatment[prop];
        }
    }    
}

export interface ITreatment {
    Id: number;
    Name: string;
    TreatmentItems: TreatmentItem[];
    IsSerumCreatNeeded: boolean;
}