export class Medicament {
    Id: number;
    Name: string;
    Dose: number;

    constructor(medicament?: IMedicament) {
        if(!medicament) {
            medicament = <IMedicament> {
                Id : 0,
                Name : '',
                Dose: 0
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
}