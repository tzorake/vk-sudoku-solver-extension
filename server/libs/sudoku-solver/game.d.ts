import { Board } from './models/board';
import { CheckerFn } from './models/checker-fn';
export declare class Game {
    private startTime;
    private endTime;
    board: Board;
    constructor(board: Board);
    isInRow: CheckerFn;
    isInCol: CheckerFn;
    isInBox(row: number, col: number, guess: number): boolean;
    isPossible(row: number, col: number, guess: number): boolean;
    findUnsolvedPosition(): [number, number];
    solve(): Board;
    getSolveTimeSeconds(): number;
    logBoard(): void;
}
