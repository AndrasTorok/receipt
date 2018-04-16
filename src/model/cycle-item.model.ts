import { Diagnostic } from './diagnostic.model';
import { Treatment } from './treatment.model';
import { TreatmentItem } from './treatment-item.model';
import { Medicament, DoseApplicationMode } from './medicament.model';
import { Cycle } from './cycle.model';
import { Patient, Gender } from './patient.model';
import { CommonEntity, IValidity, Validity } from '../common/common.entity';

export class CycleItem extends CommonEntity<CycleItem> implements ICycleItem {
    Id: number;
    CycleId: number;
    Cycle: Cycle;
    //TreatmentId: number;
    //Treatment: Treatment;
    TreatmentItemId: number;
    TreatmentItem: TreatmentItem;
    MedicamentId: number;
    Medicament: Medicament;
    OnDay: number;
    QuantityCalculated: number;
    QuantityApplied: number;
    private _calculationMap: Map<DoseApplicationMode, (patient: Patient) => number>;

    static validityMap = new Map<string, IValidity<CycleItem>[]>([
        ['TreatmentItem',
            [{
                rule: (entity: CycleItem) => !!entity.TreatmentItemId || !!entity.TreatmentItem,
                message: (entity: CycleItem) => `Tratamentul trebuie specificat.`
            }]
        ],
        ['Medicament',
            [{
                rule: (entity: CycleItem) => !!entity.MedicamentId || !!entity.Medicament,
                message: (entity: CycleItem) => `Medicamentul trebuie sa fie specificat.`
            }]
        ],
        ['OnDay',
            [{
                rule: (entity: CycleItem) => entity.OnDay !== null,
                message: (entity: CycleItem) => `Ziua trebuie sa fie specificata.`
            }]
        ],
        ['QuantityApplied',
            [{
                rule: (entity: CycleItem) => !!entity.QuantityApplied,
                message: (entity: CycleItem) => `Cantitatea aplicata trebuie sa fie specificata.`
            }]
        ]
    ]);

    static calculationMap = new Map<DoseApplicationMode, (cycleItem: CycleItem) => number>([
        [DoseApplicationMode.Sqm, (cycleItem: CycleItem) => Number((cycleItem.Medicament.Dose * cycleItem.Cycle.bodySurfaceArea).toFixed(2))],
        [DoseApplicationMode.Kg, (cycleItem: CycleItem) => Number((cycleItem.Medicament.Dose * cycleItem.Cycle.Weight).toFixed(2))],
        [DoseApplicationMode.Carboplatin, (cycleItem: CycleItem) => {
            let GFR = (cycleItem.Cycle.Gender == Gender.Male ? 1 : 0.85) * (140 - cycleItem.Cycle.age) / cycleItem.Cycle.SerumCreat * (cycleItem.Cycle.Weight / 72),
                dose = cycleItem.Medicament.Dose * (GFR + 25);

            return dose;
        }]
    ]);

    constructor(cycleItemOrCycleId: ICycleItem | number) {
        super(CycleItem.validityMap);
        let cycleItem: ICycleItem;

        if (Number.isInteger(<number>cycleItemOrCycleId)) {
            cycleItem = <ICycleItem>{
                Id: 0,
                CycleId: <number>cycleItemOrCycleId,
                //TreatmentId: 0,
                //Treatment: null,
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

    setCalculatedQuantity(patient: Patient): void {
        let calculation = CycleItem.calculationMap.get(this.Medicament.DoseApplicationMode),
            calculatedQuantity = calculation(this);

        this.QuantityCalculated = calculatedQuantity;
        this.QuantityApplied = calculatedQuantity;
    }    
}

export interface ICycleItem {
    Id: number;
    CycleId: number;
    Cycle: Cycle;
    //TreatmentId: number;
    //Treatment: Treatment;
    TreatmentItemId: number;
    TreatmentItem: TreatmentItem;
    MedicamentId: number;
    Medicament: Medicament;
    OnDay: number;
    QuantityCalculated: number;
    QuantityApplied: number;
}