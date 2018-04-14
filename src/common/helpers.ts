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