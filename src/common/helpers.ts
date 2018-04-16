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
