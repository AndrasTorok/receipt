import { Enumeration } from '../common/helpers';
import { CommonEntity, IValidity } from '../common/common.entity';

export class Medicament extends CommonEntity<Medicament> {
    Id: number;
    Name: string;
    DoseApplicationMode: DoseApplicationMode;
    Dose: number;
    Description: string;

    constructor(medicament?: IMedicament) {
        super(Medicament.validityMap);
        if (!medicament) {
            medicament = <IMedicament>{
                Id: 0,
                Name: '',
                DoseApplicationMode: DoseApplicationMode.Sqm,
                Dose: 0,
                Description: ''
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
        ],
        ['Dose',
            [{
                rule: (entity: Medicament) => !!entity.Dose,
                message: (entity: Medicament) => `Doza medicamentului trebuie sa fie specificat.`
            }
            ]
        ]
    ]);

}

export interface IMedicament {
    Id: number;
    Name: string;
    Dose: number;
    Description: string;
}

export enum DoseApplicationMode {
    Sqm, Kg, Carboplatin
}

export const DoseApplicationModeEnumeration = new Enumeration<DoseApplicationMode>(new Map<DoseApplicationMode, string>([
    [DoseApplicationMode.Sqm, 'Mp'],
    [DoseApplicationMode.Kg, 'Kg'],
    [DoseApplicationMode.Carboplatin, 'Carboplatin']
]));