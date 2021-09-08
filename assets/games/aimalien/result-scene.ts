import { BaseScene } from "./base-scene";
import { GameManager } from "./gamemanager";
import { TextObject, ButtonObject, Sound } from "./model";
import retrySound from "./sounds/menu.mp3";

// リザルト画面
export class ResultScene extends BaseScene {
    private scoreText: TextObject<string>;
    private scoreResultText: TextObject<number>;
    private killTotalText: TextObject<string>;
    private killTotalResultText: TextObject<number>;
    private killPerSecondText: TextObject<string>;
    private killPerSecondResultText: TextObject<number>;
    private accuracyText: TextObject<string>;
    private accuracyResultText: TextObject<string>;
    private bonusText: TextObject<string>;
    private bonusResultText: TextObject<number>;

    private retryButton: ButtonObject;

    private elapsedTime: number;

    private retrySound: Sound;

    constructor(gameManager: GameManager, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        super(gameManager, canvas, ctx);
    }


    setup() {
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;


        this.scoreText = new TextObject("Score", 100, centerY - 150, 55);
        const score = this.gameManager.score.score;
        this.scoreResultText = new TextObject(score, 400, centerY - 150, 55);

        this.killTotalText = new TextObject("Kill Total", 150, centerY - 50, 32);
        const killTotal = this.gameManager.score.killCount;
        this.killTotalResultText = new TextObject(killTotal, 400, centerY - 50, 32);

        this.killPerSecondText = new TextObject("Kill/s", 150, centerY, 32);
        const killPerSecond = Math.floor(this.gameManager.score.killCount / this.gameManager.score.time * 100) / 100;
        this.killPerSecondResultText = new TextObject(killPerSecond, 400, centerY, 32);

        this.accuracyText = new TextObject("Accuracy", 150, centerY + 50, 32);
        const accuracy = this.gameManager.score.clickCount != 0 ? Math.floor(this.gameManager.score.hitCount / this.gameManager.score.clickCount * 100) : 0;
        this.accuracyResultText = new TextObject(accuracy + " %", 400, centerY + 50, 32);

        this.bonusText = new TextObject("Bonus", 150, centerY + 100, 32);
        const bonus = this.gameManager.score.bonus;
        this.bonusResultText = new TextObject(bonus, 400, centerY + 100, 32);

        this.retryButton = new ButtonObject("RETRY", this.canvas.clientWidth - 200, centerY + 200, 150, 60, 30);

        this.elapsedTime = 0;

        this.retrySound = new Sound(retrySound);

        // イベント登録
        this.gameManager.addListener(this.canvas, "click", e => { this.clicked(e); })
        this.gameManager.addListener(this.canvas, "mousemove", e => { this.onMousemove(e); })
    }

    update() {
        this.elapsedTime += this.gameManager.info.frameTime;

        this.scoreText.draw(this.ctx);
        this.scoreResultText.draw(this.ctx);
        this.killTotalText.draw(this.ctx);
        this.killTotalResultText.draw(this.ctx);
        this.killPerSecondText.draw(this.ctx);
        this.killPerSecondResultText.draw(this.ctx);
        this.accuracyText.draw(this.ctx);
        this.accuracyResultText.draw(this.ctx);
        this.bonusText.draw(this.ctx);
        this.bonusResultText.draw(this.ctx);

        // 時間をおいてリトライボタン描画
        if (this.elapsedTime > 1) {
            this.retryButton.draw(this.ctx);
        }

    }

    clicked(e: Event) {
        if (!(e instanceof MouseEvent)) { return; }
        const rect = this.canvas.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
        if (this.elapsedTime > 1 && this.retryButton.testHit(point)) {
            this.retrySound.oneShot();
            // タイトルシーンへ遷移
            this.gameManager.setState("Title");
            return;
        }
    }
    onMousemove(e: Event) {
        if (!(e instanceof MouseEvent)) { return; }
        const rect = this.canvas.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
        if (this.retryButton.testHit(point)) {
            this.retryButton.hoverOver();
        } else {
            this.retryButton.hoverOut();
        }
    }
}