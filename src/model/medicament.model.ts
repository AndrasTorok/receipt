import { Enumeration } from '../common/helpers';
import { CommonEntity, IValidity } from '../common/common.entity';

export class Medicament extends CommonEntity<Medicament> {
    Id: number;
    Name: string;
    DoseApplicationMode: DoseApplicationMode;   

    constructor(medicament?: IMedicament) {
        super(Medicament.validityMap);
        if (!medicament) {
            medicament = <IMedicament>{
                Id: 0,
                Name: '',
                DoseApplicationMode: DoseApplicationMode.Sqm                
            };
        }

        for (var prop in medicament) {
            this[prop] = medicament[prop];
        }
    }

    static validityMap = new Map<string, IValidity<Medicament>[]>([
        ['Name',
            [{
                rule: (entity: Medicament) => !!entity.Name,
                message: (entity: Medicament) => `Numele medicamentului trebuie sa fie specificat.`
            },
            {
                rule: (entity: Medicament) => !entity.Name || entity.Name.length >= 2,
                message: (entity: Medicament) => `Numele medicamentului trebuie sa fie minin 2 caractere.`
            }]
        ]        
    ]);

}

export interface IMedicament {
    Id: number;
    Name: string;    
}

export enum DoseApplicationMode {
    Sqm, Kg, Carboplatin, DT
}

export const DoseApplicationModeEnumeration = new Enumeration<DoseApplicationMode>(new Map<DoseApplicationMode, string>([
    [DoseApplicationMode.Sqm, 'Mp'],
    [DoseApplicationMode.Kg, 'Kg'],
    [DoseApplicationMode.Carboplatin, 'Carboplatin'],
    [DoseApplicationMode.DT, 'DT']
]));