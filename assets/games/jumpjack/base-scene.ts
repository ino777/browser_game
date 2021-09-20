import { GameManager } from "./gamemanager"

export abstract class BaseScene {
    protected gameManager: GameManager;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    constructor(gameManager: GameManager, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.gameManager = gameManager;
    }

    abstract setup(): void;
    abstract update(): void;
}
