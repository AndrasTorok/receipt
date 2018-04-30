import { Treatment } from './treatment.model';
import { Medicament } from './medicament.model';
import { CommonEntity, IValidity } from '../common/common.entity';

export class TreatmentItem extends CommonEntity<TreatmentItem> {
    Id: number;
    TreatmentId: number;
    Treatment: Treatment;
    MedicamentId: number;
    Medicament: Medicament;
    OnDay: number;
    EndDay: number;
    DayStep: number;
    Dose: number;
    Description: string;

    constructor(treatmentItemOrId: ITreatmentItem | number) {
        super(TreatmentItem.validityMap);
        let treatmentItem: ITreatmentItem;

        if (Number.isInteger(<number>treatmentItemOrId)) {
            treatmentItem = <ITreatmentItem>{
                Id: 0,
                TreatmentId: <number>treatmentItemOrId,
                MedicamentId: 0,
                OnDay: 0,
                Dose: 0,
                Description: ''
            };
        } else treatmentItem = <ITreatmentItem>treatmentItemOrId;

        for (var prop in treatmentItem) {
            this[prop] = treatmentItem[prop];
        }
    }

    static validityMap = new Map<string, IValidity<TreatmentItem>[]>([
        ['OnDay',
            [{
                rule: (entity: TreatmentItem) => entity.OnDay != null && entity.OnDay != undefined,
                message: (entity: TreatmentItem) => `Ziua de aplicare trebuie sa fie specificat.`
            }]
        ],
        ['EndDay',
            [{
                rule: (entity: TreatmentItem) => entity.EndDay ==null || entity.EndDay == undefined || entity.EndDay > entity.OnDay,
                message: (entity: TreatmentItem) => `Pana in ziua de aplicare trebuie sa fie mai mare decat ziua din care se incepe aplicarea.`
            },
            {
                rule: (entity: TreatmentItem) => !entity.DayStep || !!entity.EndDay,
                message: (entity: TreatmentItem) => `Pana in ziua de aplicare trebuie sa fie mai mare decat ziua din care se incepe aplicarea.`
            }]
        ],
        ['DayStep',
            [{
                rule: (entity: TreatmentItem) => entity.DayStep == null || entity.DayStep == undefined || entity.EndDay > entity.OnDay,
                message: (entity: TreatmentItem) => `Pana in ziua de aplicare trebuie sa fie mai mare decat ziua din care se incepe aplicarea.`
            }]
        ],
        ['Medicament',
            [{
                rule: (entity: TreatmentItem) => !!entity.Medicament || !!entity.MedicamentId,
                message: (entity: TreatmentItem) => `Medicamentul trebuie sa fie specificat.`
            }]
        ],
        ['Dose',
            [{
                rule: (entity: TreatmentItem) => !!entity.Dose,
                message: (entity: TreatmentItem) => `Doza medicamentului trebuie sa fie specificat.`
            }]
        ],
        ['Description',
            [{
                rule: (entity: TreatmentItem) => !!entity.Description,
                message: (entity: TreatmentItem) => `Descrierea aplicarii medicamentului trebuie sa fie specificat.`
            }]
        ]
    ]);
}

export interface ITreatmentItem {
    Id: number;
    TreatmentId?: number;
    Treatment: Treatment;
    MedicamentId?: number;
    Medicament: Medicament;
    OnDay: number;
    EndDay?: number;
    DayStep?: number;
    Dose: number;
    Description: string;
}