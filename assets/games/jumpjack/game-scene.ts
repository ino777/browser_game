import { PlayScene } from "./play-scene";
import { GameManager } from "./gamemanager";

export class GameScene {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private animationRequestId: number;

    private gameManager: GameManager;
    private playScene: PlayScene;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    setup() {
        this.gameManager = new GameManager("Play");
        this.playScene = new PlayScene(this.gameManager, this.canvas, this.ctx);
        this.playScene.setup();
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth+5, this.canvas.clientHeight+5)
        this.playScene.update();

    }

    start() {
        this.setup();

        let startTime = performance.now();
        let lastTime = 0;
        let deltaTime = 0;
        // フレーム毎に実行
        let animate = () => {
            this.animationRequestId = requestAnimationFrame(animate);

            // fps 取得
            lastTime = performance.now();
            deltaTime = lastTime - startTime;
            startTime = performance.now();
            this.update();
        }
        animate();


    }

    end() {
        cancelAnimationFrame(this.animationRequestId);
    }
}





