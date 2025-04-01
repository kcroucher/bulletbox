const boardCoords = Array.from(Array(8).keys());
type BoardCoord = typeof boardCoords[number];

const chessFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
type ChessFile = typeof chessFiles[number];

const chessRanks = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
type ChessRank = typeof chessRanks[number];

type SquareName = `${ChessFile}${ChessRank}`;

const coordToFile = Object.fromEntries(
    boardCoords.map((coord, i) => [coord, chessFiles[i]])
) as Record<BoardCoord, ChessFile>;

const fileToCoord = Object.fromEntries(
    chessFiles.map((file, i) => [file, boardCoords[i]])
) as Record<ChessFile, BoardCoord>;

export enum Promotion {
    Queen = 'q',
    Knight = 'n',
    Rook = 'r',
    Bishop = 'b'
}

export class Square {
    x: BoardCoord;
    y: BoardCoord;

    constructor(x: BoardCoord, y: BoardCoord) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return `${coordToFile[this.x]}${this.y + 1}`;
    }

    static fromName(name: SquareName): Square {
        const file = name[0].toLowerCase() as ChessFile;
        const rank = parseInt(name[1]) - 1 as BoardCoord;
        return new Square(fileToCoord[file], rank);
    }
}

export class Board {
    private readonly element: Element;
    private readonly left: number;
    private readonly top: number;
    private readonly squareWidth: number;
    private readonly squareOffset: number;

    constructor(element: Element, squareBound: DOMRect) {
        this.element = element;
        this.left = squareBound.x;
        this.top = squareBound.y;
        this.squareWidth = squareBound.width;
        this.squareOffset = this.squareWidth / 2;
    }

    private event(name: string, square: Square): void {
        this.element.dispatchEvent(new PointerEvent(name, {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: this.left + (this.squareWidth * square.x) + this.squareOffset,
            clientY: this.top + (this.squareWidth * (7 - square.y)) + this.squareOffset,
        }));
    }

    select(square: Square): void {
        this.event('pointerdown', square);
        this.event('pointerup', square);
    }

    promote(piece: Promotion): void {
        let element = document.querySelector(`.promotion-piece.w${piece}`);
        if (!element) {
            element = document.querySelector(`.promotion-piece.b${piece}`);
        }
        if (!element) return;

        element.dispatchEvent(new PointerEvent('pointerdown', {
            bubbles: true,
            cancelable: true,
            view: window,
        }));
    }
}
