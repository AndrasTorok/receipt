export abstract class Entity<T> {
    _$initialEntity: T;
    _$state: EntityState = EntityState.New;

    constructor(entity?: T) {

        if (!entity) {
            entity = this.$new();
            this._$state = EntityState.Added;
        } else {
            this._$state = EntityState.New;
        }

        this.$properties().forEach(propertyName => {
            const privatePropertyName = `_${propertyName}`,
                propertyValue = entity[propertyName];

            this._$initialEntity[propertyName] = propertyValue;
            this[propertyName] = propertyValue;

            Object.defineProperty(this, propertyName, {
                get: () => {
                    return this[privatePropertyName];
                },
                set: (value: any) => {
                    if (this[privatePropertyName] !== value) {
                        this[privatePropertyName] = value;

                        if (this._$state === EntityState.New) {
                            this._$state = EntityState.Changed;
                        }
                    }
                }
            });
        });
    }

    abstract $properties(): string[];
    abstract $new(): T;

    $remove(): void {
        this._$state = EntityState.Removed;
    }

    $equals(that: T): boolean {
        return false;
    }

    get $dirty(): boolean {
        return false;
    }

    get $valid(): boolean {
        return true;
    }
}

enum EntityState {
    New, Added, Changed, Removed
}

interface IEntity {
    $equals(): boolean;
}
