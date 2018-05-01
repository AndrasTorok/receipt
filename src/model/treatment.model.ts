import { TreatmentItem } from './treatment-item.model';
import { CommonEntity, IValidity } from '../common/common.entity';

export class Treatment extends CommonEntity<Treatment> {
    Id: number;
    Name: string;
    TreatmentItems: TreatmentItem[];
    IsSerumCreatNeeded: boolean;
    IsDefault: boolean;

    constructor(treatment?: ITreatment) {
        super(Treatment.validityMap);
        if (!treatment) {
            treatment = <ITreatment>{
                Id: 0,
                Name: '',
                IsSerumCreatNeeded: false,
                IsDefault: false,
                TreatmentItems: []
            };
        }

        for (var prop in treatment) {
            this[prop] = treatment[prop];
        }
    }    

    static validityMap = new Map<string, IValidity<Treatment>[]>([
        ['Name',
            [{
                rule: (entity: Treatment) => !!entity.Name,
                message: (entity: Treatment) => `Numele tratamentului trebuie sa fie specificat.`
            },
            {
                rule: (entity: Treatment) => !entity.Name || entity.Name.length >= 2,
                message: (entity: Treatment) => `Numele tratamentului trebuie sa fie minin 2 caractere.`
            }]
        ]
    ]);
}

export interface ITreatment {
    Id: number;
    Name: string;
    TreatmentItems: TreatmentItem[];
    IsSerumCreatNeeded: boolean;
    IsDefault: boolean;
}