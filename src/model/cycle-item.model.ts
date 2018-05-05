import { Diagnostic } from './diagnostic.model';
import { Treatment } from './treatment.model';
import { TreatmentItem } from './treatment-item.model';
import { Medicament, DoseApplicationMode, DoseApplicationUnit } from './medicament.model';
import { Cycle } from './cycle.model';
import { Patient, Gender } from './patient.model';
import { CommonEntity, IValidity, Validity } from '../common/common.entity';

export class CycleItem extends CommonEntity<CycleItem> implements ICycleItem {
    Id: number;
    CycleId: number;
    Cycle: Cycle;
    TreatmentItemId: number;
    TreatmentItem: TreatmentItem;
    MedicamentId: number;
    Medicament: Medicament;
    OnDay: number;
    QuantityCalculated: number;
    QuantityApplied: number;
    Description: string;    

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
        [DoseApplicationMode.Sqm, (cycleItem: CycleItem) => Number((cycleItem.TreatmentItem.Dose * cycleItem.Cycle.bodySurfaceArea).toFixed(2))],
        [DoseApplicationMode.Kg, (cycleItem: CycleItem) => Number((cycleItem.TreatmentItem.Dose * cycleItem.Cycle.Weight).toFixed(2))],
        [DoseApplicationMode.Carboplatin, (cycleItem: CycleItem) => {
            let GFR = (cycleItem.Cycle.Gender == Gender.Male ? 1 : 0.85) * (140 - cycleItem.Cycle.age) / cycleItem.Cycle.SerumCreat * (cycleItem.Cycle.Weight / 72),
                dose = cycleItem.TreatmentItem.Dose * (GFR + 25);

            return dose;
        }],
        [DoseApplicationMode.DT, (cycleItem: CycleItem) => Number((cycleItem.TreatmentItem.Dose).toFixed(2))]
    ]);

    constructor(cycleItemOrCycleId: ICycleItem | number, cycle?: Cycle) {
        super(CycleItem.validityMap);
        let cycleItem: ICycleItem;

        if (Number.isInteger(<number>cycleItemOrCycleId)) {
            cycleItem = <ICycleItem>{
                Id: 0,
                CycleId: <number>cycleItemOrCycleId,
                TreatmentItemId: 0,
                TreatmentItem: null,
                MedicamentId: 0,
                Medicament: null
            };
        } else cycleItem = <ICycleItem>cycleItemOrCycleId;

        for (var prop in cycleItem) {
            if (/^[A-Z]/.test(prop)) {
                this[prop] = cycleItem[prop];
            }
        }

        if (cycle) this.Cycle = cycle;
    }

    setCalculatedQuantity(): void {
        let calculation = CycleItem.calculationMap.get(this.Medicament.DoseApplicationMode),
            calculatedQuantity = calculation(this);

        if(calculatedQuantity > 1000) {
            calculatedQuantity = Math.round(calculatedQuantity);
        } else if(calculatedQuantity > 100) {
            calculatedQuantity = Math.round(calculatedQuantity * 10) / 10;
        } else {
            calculatedQuantity = Math.round(calculatedQuantity * 100) / 100;
        }        

        this.QuantityCalculated = calculatedQuantity;
        this.QuantityApplied = calculatedQuantity;
    }

    get onDate(): Date {
        let date = null;

        if (this.Cycle) {
            date = new Date(this.Cycle.StartDate.toString());

            date.setDate(date.getDate() + this.OnDay - 1);                  //from the onDate we substract one all the time
        }

        return date;
    }

    get doseUnit(): string {        
        return this.TreatmentItem && this.Medicament ? `${this.TreatmentItem.Dose} ${DoseApplicationUnit.get(this.Medicament.DoseApplicationMode)}` : '';        
    }
}

export interface ICycleItem {
    Id: number;
    CycleId: number;
    Cycle: Cycle;
    TreatmentItemId: number;
    TreatmentItem: TreatmentItem;
    MedicamentId: number;
    Medicament: Medicament;
    OnDay: number;
    QuantityCalculated: number;
    QuantityApplied: number;
    Description?: string;
}