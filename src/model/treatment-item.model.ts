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

    constructor(treatmentItemOrId: ITreatmentItem | number) {
        super(TreatmentItem.validityMap);
        let treatmentItem: ITreatmentItem;

        if (Number.isInteger(<number>treatmentItemOrId)) {
            treatmentItem = <ITreatmentItem>{
                Id: 0,
                TreatmentId: <number>treatmentItemOrId,
                MedicamentId: 0,
                OnDay: 0
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
        ['Medicament',
            [{
                rule: (entity: TreatmentItem) => !!entity.Medicament || !!entity.MedicamentId,
                message: (entity: TreatmentItem) => `Medicamentul trebuie sa fie specificat.`
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
}