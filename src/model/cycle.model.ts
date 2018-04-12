import { Diagnostic } from './diagnostic.model';
import { Treatment } from './treatment.model';
import { CycleItem, ICycleItem } from './cycle-item.model';

export class Cycle implements ICycle {
    Id: number;
    DiagnosticId: number;
    Diagnostic: Diagnostic;
    TreatmentId: number;
    Treatment: Treatment;
    StartDate: Date;
    CycleItems: CycleItem[];

    constructor(cycleOrDiagnosticId: ICycle | number) {
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

        if(cycle.CycleItems) {
            this.CycleItems = cycle.CycleItems.map(ci=> new CycleItem(ci));
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