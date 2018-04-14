import { Diagnostic } from './diagnostic.model';
import { Treatment } from './treatment.model';
import { CycleItem, ICycleItem } from './cycle-item.model';
import { CommonEntity, IValidity, Validity } from '../common/common.entity';

export class Cycle extends CommonEntity<Cycle> implements ICycle {
    Id: number;
    DiagnosticId: number;
    Diagnostic: Diagnostic;
    TreatmentId: number;
    Treatment: Treatment;
    StartDate: Date;
    SerumCreat?: number;
    CycleItems: CycleItem[];

    static validityMap = new Map<string, IValidity<Cycle>>([
        ['Diagnostic', new Validity(
            (entity: Cycle) => !!entity.DiagnosticId || !!entity.Diagnostic,
            (entity: Cycle) => `Diagnostic trebuie sa fie specificat.`)],
        ['Treatment', new Validity(
            (entity: Cycle) => !!entity.TreatmentId || !!entity.Treatment,
            (entity: Cycle) => `Tratementul pacientului trebuie sa fie specificat.`)
        ],
        ['StartDate', new Validity(
            (entity: Cycle) => !!entity.StartDate,
            (entity: Cycle) => `Data de inceput ciclului de tratament trebuie sa fie specificata.`)
        ],
        ['CycleItems', new Validity(
            (entity: Cycle) => !entity.CycleItems || !entity.CycleItems.some(ci => !ci.$valid()),
            (entity: Cycle) => ``)
        ]
    ]);

    constructor(cycleOrDiagnosticId: ICycle | number) {
        super(Cycle.validityMap);
        let cycle: ICycle;

        if (Number.isInteger(<number>cycleOrDiagnosticId)) {
            cycle = <ICycle>{
                Id: 0,
                DiagnosticId: <number>cycleOrDiagnosticId,
                Diagnostic: null,
                TreatmentId: 0,
                Treatment: null,
                StartDate: new Date(),
                CycleItems: []
            };
        } else cycle = <ICycle>cycleOrDiagnosticId;

        for (var prop in cycle) {
            this[prop] = cycle[prop];
        }

        if (cycle.CycleItems) {
            this.CycleItems = cycle.CycleItems.map(ci => new CycleItem(ci));
        }

        this.StartDate = new Date(cycle.StartDate.toString());
    }
}

export interface ICycle {
    Id: number;
    DiagnosticId: number;
    Diagnostic: Diagnostic;
    TreatmentId: number;
    Treatment: Treatment;
    StartDate: Date;
    CycleItems: ICycleItem[];
}