export class StringBuilder {
    private store = [];

    constructor(...args: string[]) {
        this.append.apply(this, args);
    }

    append(...args: string[]): StringBuilder {
        for (var i = 0; i < args.length; i++) this.store.push(args[i]);
        return this;                                                                                //make it fluent
    }

    get isEmpty(): boolean { return !this.store.length; }

    toString(joinStr?: string): string {                                                            //optional string argument as join character
        return this.store.join(joinStr !== undefined ? joinStr : '');
    }
}

export interface IKeyValuePair<TKey, TValue> {
    key: TKey;
    value: TValue;
}

export class KeyValuePair<TKey, TValue> implements IKeyValuePair<TKey, TValue> {

    constructor(
        public key: TKey,
        public value: TValue
    ) {

    }
}

export class Enumeration<TEnum> {
    private _keyValuePairs: IKeyValuePair<TEnum, string>[];

    constructor(
        private _map: Map<TEnum, string>
    ) {
        this._keyValuePairs = [];

        _map.forEach((value, key) => {
            this._keyValuePairs.push(<IKeyValuePair<TEnum, string>>{
                key: key,
                value: value
            });
        });
    }

    get keyValuePairs(): IKeyValuePair<TEnum, string>[] {
        return this._keyValuePairs;
    }

    get(key: TEnum): string {
        return this._map.get(key);
    }
}

export class Calculation {
    static bodySurfaceArea(height: number, weight: number): number {
        let area = 0;

        if (height && weight) {
            area = 0.20247 * Math.pow(height / 100, 0.725) * Math.pow(weight, 0.425);
        }

        return area;
    }

    static age(birthDate: Date, date?: Date): number {
        let age = 0;

        if (typeof birthDate == 'string') birthDate = new Date(birthDate);
        if (typeof date == 'string') date = new Date(date);

        let now = date ? date : new Date(),
            months = now.getMonth() - birthDate.getMonth();

        age = now.getFullYear() - birthDate.getFullYear();

        if (months < 0 || (months === 0 && now.getDate() < birthDate.getDate())) {
            age--;
        }


        return age;
    }
}
