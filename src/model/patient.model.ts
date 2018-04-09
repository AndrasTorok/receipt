export class Patient implements IPatient {
    Id?: number;
    CNP: string;
    FirstName: string;
    LastName: string;
    BirthDate: Date;
    Gender: Gender;
    Height: number;
    Weight: number;

    constructor(
        patient?: IPatient
    ) {
        if (!patient) {
            patient = <IPatient>{
                CNP: '',
                FirstName: '',
                LastName: "",
                BirthDate: new Date(),
                Gender: Gender.Male,
                Height: 170,
                Weight: 60
            };
        }

        for (var prop in patient) {
            this[prop] = patient[prop];            
        }

        this.BirthDate = new Date(patient.BirthDate.toString());
    }

    get Age(): number {
        let age = 0;

        if (this.BirthDate) {
            let birthDate = new Date(this.BirthDate),
                now = new Date(),
                months = now.getMonth() - birthDate.getMonth();

            age = now.getFullYear() - birthDate.getFullYear();

            if (months < 0 || (months === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        return age;
    }

    get BodySurfaceArea(): number {
        let area = 0;

        if (this.Height && this.Weight) {
            area = 0.20247 * Math.pow(this.Height / 100, 0.725) * Math.pow(this.Weight, 0.425);
        }

        return area;
    }

    get GenderDisplay(): string {
        return this.Gender == Gender.Male ? 'M' : 'F';
    }

    extractCNP(): void {
        let cnp = this.CNP,
            genderStr = cnp.substr(0, 1),
            yearStr = cnp.substr(1, 2),
            monthStr = cnp.substr(3, 2),
            dayStr = cnp.substr(5, 2),
            year = Number(yearStr),
            month = Number(monthStr) - 1,
            day = Number(dayStr);

        year += [Male20thCentury, Female20thCentury].includes(genderStr) ? 1900 : 2000;
        this.BirthDate = new Date(year, month, day);
        this.Gender = [Male20thCentury, Male21stCentury].includes(genderStr) ? Gender.Male : Gender.Female;
    }
}

const Male20thCentury = '1', Female20thCentury = '2', Male21stCentury = '5', Female21stCentury = '6';

export interface IPatient {
    FirstName: string,
    LastName: string,
    BirthDate: Date,
    Gender: Gender,
    Height: number,
    Weight: number
}

export enum Gender {
    Male, Female
}