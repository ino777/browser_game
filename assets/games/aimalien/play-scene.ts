import { BaseScene } from "./base-scene";
import { Target, Octpus, Ray, TextObject, Alien, RectEffect, Effect, ExplosionEffect, Sound } from "./model";
import { GameManager } from "./gamemanager";
import shotSound from "./sounds/shot.mp3";
import criticalShotSound from "./sounds/shot-critical.mp3";
import failSound from "./sounds/fail.mp3";

// プレイ画面
export class PlayScene extends BaseScene {
    private targetSize: number;
    private targetList: Target[]; // ターゲットの配列
    private displayNum: number;    // 一度に表示するターゲットの数

    private killCount: number;  // 倒した回数
    private clickCount: number;  // クリック回数
    private hitCount: number;    // 当たった回数
    private failCount: number;  // 外れた回数
    private bonusTotal: number  // ボーナス合計

    //チェイン？

    private score: number;  // スコアポイント
    readonly hitPlus: number = 50;
    readonly failMinus: number = 30;
    readonly bonusPlus: number = 50;

    private scoreText: TextObject<number>;

    private elapsedTime: number;  // 経過時間
    private limitTime: number;  // 制限時間
    private timeText: TextObject<string>;

    // 音声
    private shotSound: Sound;
    private criticalShotSound: Sound;
    private failSound: Sound;

    private effects: Effect[];  // エフェクトの配列

    constructor(gameManager: GameManager, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        super(gameManager, canvas, ctx);
    }

    setup() {
        switch (this.gameManager.getLevel()) {
            case "Normal":
                this.targetSize = 35;
                break;
            case "Hard":
                this.targetSize = 20;
                break;
        }
        this.targetList = [];
        this.displayNum = 5;

        this.killCount = 0;
        this.clickCount = 0;
        this.hitCount = 0;
        this.failCount = 0;
        this.bonusTotal = 0;

        this.score = 0;
        this.scoreText = new TextObject(this.score, this.canvas.clientWidth / 2 - 100, 25);
        this.scoreText.textAlign = "end";

        this.elapsedTime = 0;
        this.limitTime = 20;
        this.timeText = new TextObject(this.limitTime.toString(), this.canvas.clientWidth / 2, 25);

        this.shotSound = new Sound(shotSound);
        this.criticalShotSound = new Sound(criticalShotSound);
        this.failSound = new Sound(failSound);

        this.effects = [];

        // canvas内にランダムにTargetを配置
        for (let i = 0; i < this.displayNum; i++) {
            this.targetList.push(this.createTarget());
        }

        // イベント登録
        this.gameManager.addListener(this.canvas, "mousedown", e => { this.onMousedown(e); })
    }

    update() {
        // 時間経過で終了
        if (this.elapsedTime >= this.limitTime) {
            this.gameManager.score.score = this.score;
            this.gameManager.score.time = this.limitTime;
            this.gameManager.score.killCount = this.killCount;
            this.gameManager.score.clickCount = this.clickCount;
            this.gameManager.score.hitCount = this.hitCount;
            this.gameManager.score.failCount = this.failCount;
            this.gameManager.score.bonus = this.bonusTotal;

            // リザルトシーンへ遷移
            this.gameManager.setState("Result");
            return;
        }

        this.elapsedTime += this.gameManager.info.frameTime;

        // 描画
        this.targetList.forEach(t => {
            t.reflectMove(0, this.canvas.clientHeight, 0, this.canvas.clientWidth);
            t.animate();
            t.draw(this.ctx);
        });
        this.timeText.text = (this.limitTime - this.elapsedTime).toFixed(1);
        this.timeText.draw(this.ctx);

        this.scoreText.text = this.score;
        this.scoreText.draw(this.ctx);

        // エフェクト描画
        this.effects.forEach(e => {
            e.update();
            e.render(this.ctx);
        })

    }

    onMousedown(e: Event) {
        if (!(e instanceof MouseEvent)) { return; }

        const rect = this.canvas.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        this.clickCount += 1;

        // 同時にヒットした数
        let hitNum = 0;
        // 同時に何体当たったか判定
        this.targetList.forEach(t => {
            if (t.testHit(point)) {
                t.clicked();
                hitNum += 1;
            }
        })

        if (hitNum == 0) {
            // 外れ
            this.failCount += 1;
            this.score -= this.failMinus;
            this.failSound.oneShot();
            this.effects.push(new RectEffect(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2, 1, this.canvas.clientWidth, this.canvas.clientHeight, "white"));
        } else if (hitNum == 1) {
            // 1体
            this.killCount += hitNum;
            this.hitCount += 1;
            this.score += this.hitPlus;
            this.shotSound.oneShot();
            this.effects.push(new ExplosionEffect(point.x, point.y, 20, 10, "white", 1));
        } else {
            // 2体以上
            this.killCount += hitNum;
            this.hitCount += 1;
            const bonus = this.bonusPlus * (hitNum - 1)
            this.score += this.hitPlus * hitNum + bonus;
            this.bonusTotal += bonus;
            this.criticalShotSound.oneShot();
            this.effects.push(new ExplosionEffect(point.x, point.y, 20, 10, "white", hitNum));
        }

        /***************************** */

        // 表示制限より少なければターゲット追加
        const remainNum = this.targetList.length - this.killCount;
        if (remainNum < this.displayNum) {
            for (let i = 0; i < this.displayNum - remainNum; i++) {
                this.targetList.push(this.createTarget());
            }

        }

    }

    createTarget(x?: number, y?: number, size?: number): Target {
        const targetSize = size != undefined ? size : this.targetSize;
        const targetX = x != undefined ? x : targetSize + (this.canvas.clientWidth - 2 * targetSize) * Math.random();
        const targetY = y != undefined ? y : targetSize + (this.canvas.clientHeight - 2 * targetSize) * Math.random();
        let target: Target;
        const targetTypeNum = 3;
        const targetType = Math.floor(Math.random() * targetTypeNum);
        switch (targetType) {
            case 0:
                target = new Octpus(targetX, targetY, targetSize);
                break;
            case 1:
                target = new Ray(targetX, targetY, targetSize);
                break;
            case 2:
                target = new Alien(targetX, targetY, targetSize);
                break;
            default:
                target = new Octpus(targetX, targetY, targetSize);
        }
        return target;
    }

}
