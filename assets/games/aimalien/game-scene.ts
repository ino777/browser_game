import { TitleScene } from "./title-scene";
import { GameManager, GameState } from "./gamemanager";
import { PlayScene } from "./play-scene";
import { ResultScene } from "./result-scene";
import { BaseScene } from "./base-scene";


export class GameScene {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private gameManager: GameManager;
    private titleScene: TitleScene;
    private playScene: PlayScene;
    private resultScene: ResultScene;
    private animationRequestId: number;

    private selectedScene: BaseScene;

    sceneMap: Map<GameState, BaseScene>;


    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    setup() {
        this.gameManager = new GameManager("Title");

        this.titleScene = new TitleScene(this.gameManager, this.canvas, this.ctx);
        this.playScene = new PlayScene(this.gameManager, this.canvas, this.ctx);
        this.resultScene = new ResultScene(this.gameManager, this.canvas, this.ctx);

        this.sceneMap = new Map<GameState, BaseScene>();
        this.sceneMap.set("Title", this.titleScene);
        this.sceneMap.set("Play", this.playScene);
        this.sceneMap.set("Result", this.resultScene);
    }

    update() {
        const state = this.sceneMap.get(this.gameManager.getState());
        if (!state) {
            console.error("Invalid state.")
            this.end();
            return;
        }

        this.selectedScene = state;
        if (this.gameManager.onTransition) {
            this.gameManager.removeAllListener();
            this.selectedScene.setup();
            this.gameManager.onTransition = false;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // 背景
        this.ctx.fillStyle = "rgb(10, 10, 15)";
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.selectedScene.update();
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
            this.gameManager.info.frameTime = deltaTime / 1000;
            this.gameManager.info.fps = 1000.0 / deltaTime;
            startTime = performance.now();

            this.update();
        }
        animate();

    }

    end() {
        cancelAnimationFrame(this.animationRequestId);
    }
}





