import { Diagnostic } from './diagnostic.model';
import { Treatment } from './treatment.model';
import { TreatmentItem } from './treatment-item.model';
import { Medicament, DoseApplicationMode } from './medicament.model';
import { Cycle } from './cycle.model';
import { Patient } from './patient.model';
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

    static validityMap = new Map<string, IValidity<CycleItem>>([
        ['TreatmentItem', new Validity(
            (entity: CycleItem) => !!entity.TreatmentItemId || !!entity.TreatmentItem,
            (entity: CycleItem) => `Tratamentul trebuie specificat.`)
        ],
        ['Medicament', new Validity(
            (entity: CycleItem) => !!entity.MedicamentId || !!entity.Medicament,
            (entity: CycleItem) => `Medicamentul trebuie sa fie specificat.`)
        ],
        ['OnDay', new Validity(
            (entity: CycleItem) => entity.OnDay !== null,
            (entity: CycleItem) => `In ziua trebuie sa fie specificata.`)
        ],
        ['QuantityApplied', new Validity(
            (entity: CycleItem) => !!entity.QuantityApplied,
            (entity: CycleItem) => `Cantitatea aplicata trebuie sa fie specificata.`)
        ]
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
        let calculatedQuantity = this.calculatedQuantity(patient);

        this.QuantityCalculated = calculatedQuantity;
        this.QuantityApplied = calculatedQuantity;
    }

    calculatedQuantity(patient: Patient): number {
        let calculationMap = this.getCalculationMap(),
            calculation = calculationMap.get(this.Medicament.DoseApplicationMode),
            calculatedQuantity = calculation(patient);

        return calculatedQuantity;
    }

    private getCalculationMap(): Map<DoseApplicationMode, (patient: Patient) => number> {
        if (!this._calculationMap) {
            this._calculationMap = new Map<DoseApplicationMode, (patient: Patient) => number>();

            this._calculationMap.set(DoseApplicationMode.Sqm, (patient: Patient) => Number((this.Medicament.Dose * patient.BodySurfaceArea).toFixed(2)));
            this._calculationMap.set(DoseApplicationMode.Kg, (patient: Patient) => Number((this.Medicament.Dose * patient.Weight).toFixed(2)));
        }

        return this._calculationMap;
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