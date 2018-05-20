import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
    transform<T>(array: Array<any>, orderField: string, isAscending: boolean): T[] {

        array.sort((firstObject: any, secondObject: any) => {
            let firstValue = firstObject[orderField],
                secondValue = secondObject[orderField];

            if (firstValue === undefined && secondValue === undefined) {
                return 0;
            }
            if (firstValue === undefined && secondValue !== undefined) {
                return isAscending ? 1 : -1;
            }
            if (firstValue !== undefined && secondValue === undefined) {
                return isAscending ? -1 : 1;
            }
            if (firstValue === secondValue) {
                return 0;
            }

            const isString = typeof (firstValue) === 'string' || typeof (secondValue) === 'string';

            if (isString) {
                firstValue = firstValue.toString().toLowerCase();
                secondValue = secondValue.toString().toLowerCase();
            }

            return isAscending ? (firstValue > secondValue ? -1 : 1) : (secondValue > firstValue ? -1 : 1);
        });

        return array;
    }
}
