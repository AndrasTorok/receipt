export interface IPosition {
    x: number;
    y: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IMargin {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

export class Rectangle {
    top: number;
    left: number;
    bottom: number;
    right: number;

    constructor(
        position: IPosition,
        public size: ISize
    ) {
        this.top = position.x;
        this.left = position.y;
        this.right = position.x + size.height;
        this.bottom = position.y + size.width;
    }

}

export class Font {
    constructor(
        public fontName: string, 
        public fontSize: number, 
        public fontStyle: string
    ) {

    }

    get fontSizeInMmm() { return this.fontSize / 2.54; }
}