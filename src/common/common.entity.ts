export const DoDebug = true;

export abstract class CommonEntity<T extends ICommonEntity> implements ICommonEntity  {

    constructor(
        private _validityMap: Map<string, IValidity<T>>
    ) {

    }

    $valid(prop?: string): boolean {
        let isValid = true;

        if (prop) {
            let validity = this._validityMap.get(prop);

            if (validity && validity.rule) isValid = validity.rule(<any>this);
        } else isValid = !this.$invalidProperties().length;

        return isValid;
    }

    $invalidProperties(): string[] {
        let invalidProperties: string[] = [];

        this._validityMap.forEach((validity, prop) => {
            if (validity && !validity.rule(<any>this)) invalidProperties.push(prop);
        });

        if(DoDebug && invalidProperties.length) console.log(`Invalid properties: ${invalidProperties.join(', ')}`);

        return invalidProperties;
    }
}

interface ICommonEntity {
    $valid(prop?: string): boolean;
    $invalidProperties(): string[];
}

export interface IValidity<T extends ICommonEntity> {
    rule: (entity: T) => boolean;
    message: (entity: T) => string;
}

export class Validity<T extends ICommonEntity> implements IValidity<T> {

    constructor(
        public rule: (entity: T) => boolean,
        public message: (entity: T) => string
    ) {

    }
}