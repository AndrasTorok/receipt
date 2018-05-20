export const DoDebug = true;

export abstract class CommonEntity<T extends ICommonEntity> implements ICommonEntity {

    constructor(
        private _validityMap: Map<string, IValidity<T>[]>
    ) {

    }

    $valid(prop?: string): boolean {
        let isValid = true;

        if (prop) {
            const validities = this._validityMap.get(prop);

            if (validities) {
                isValid = !validities.some(validity => !validity.rule(<any>this));
            }
        } else {
            this._validityMap.forEach((validities) => {
                if (validities) {
                    if (validities.some(validity => !validity.rule(<any>this))) {
                        isValid = false;
                    }
                }
            });
        }

        return isValid;
    }

    $invalidProperties(): string[] {
        const invalidProperties: string[] = [];

        this._validityMap.forEach((validities, prop) => {
            if (validities) {
                if (validities.some(validity => !validity.rule(<any>this))) {
                    invalidProperties.push(prop);
                }
            }
        });

        if (DoDebug && invalidProperties.length) {
            console.log(`Invalid properties: ${invalidProperties.join(', ')}`);
        }
        return invalidProperties;
    }

    $invalidMessages(prop: string): string[] {
        const validities = this._validityMap.get(prop),
            messages: string[] = validities.filter(validity => !validity.rule(<any>this)).map(validity => validity.message(<any>this));

        return messages;
    }
}

export interface ICommonEntity {
    $valid(prop?: string): boolean;
    $invalidProperties(): string[];
    $invalidMessages(prop: string): string[];
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
