import {ISize, IMargin} from './helpers';

export class PdfPage {
    size: ISize;

    constructor(
        public orientation: PageOrientation = PageOrientation.Portait,
        public unit: PageUnit = PageUnit.mm,
        public format: PageFormat = PageFormat.A4,
        public margin?: IMargin
    ) {
        if (!this.margin) this.margin = <IMargin>{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        };
        if (this.format == PageFormat.A4) {
            this.size = <ISize>{
                width: 210,
                height: 297
            };
        }
    }
}

export enum PageOrientation {
    Landscape = 'l', Portait = 'p'
}

export enum PageUnit {
    mm = 'mm', pt = 'pt', cm = 'cm', in = 'in'
}

export enum PageFormat {
    A4 = 'a4'
}

