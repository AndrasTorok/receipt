export class Medicament {
    Id: number;
    Name: string;
    DoseApplicationMode: DoseApplicationMode;
    Dose: number;    
    Description: string;   

    constructor(medicament?: IMedicament) {
        if(!medicament) {
            medicament = <IMedicament> {
                Id : 0,
                Name : '',
                Dose: 0,
                Description: ''
            };
        }

        for(var prop in medicament) {
            this[prop]  = medicament[prop];
        }
    }
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