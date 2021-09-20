import { BaseScene } from "./base-scene";
import { Actor, Obstacle, Camera, CollideObject, Stage, ObstacleParams, GToW, direction, CollisionDetector, WToG, StageGimmick, Wind, TextObject, Sound } from "./models"
import { GameManager } from "./gamemanager";
import * as stages from "./stage";

import fanfareSound from "./sounds/fanfare.mp3";

// プレイ画面
export class PlayScene extends BaseScene {
    // ゲーム内オブジェクト
    private actor: Actor;
    private stage: Stage;
    private camera: Camera;
    private goalText: TextObject;
    private goalSound: Sound;

    // 当たり判定を行う検出器
    private collisionDetector: CollisionDetector;

    // キー入力のバッファ
    private input_buffer: Map<string, boolean>;
    private input_flag: boolean = true;

    constructor(gameManager: GameManager, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        super(gameManager, canvas, ctx);
        this.input_buffer = new Map<string, boolean>();
    }

    setup() {

        this.camera = new Camera({ x: this.canvas.clientWidth / 2, y: this.canvas.clientHeight / 2 }, this.canvas);

        this.actor = new Actor({ x: 100, y: 100 }, 40, 40);
        const stageObstacles: Obstacle[] = [];
        stages.stageObstacles.forEach(p => {
            stageObstacles.push(new Obstacle(p));
        })
        const stageGimmicks: StageGimmick[] = [];
        stages.statgeWind.forEach(p => {
            stageGimmicks.push(new Wind(p));
        })
        this.stage = new Stage(stageObstacles, stageGimmicks);

        this.collisionDetector = new CollisionDetector();

        this.goalText = new TextObject({x: 220, y: 200}, "Congratulations!", 50);
        this.goalText.isActive = false;

        this.goalSound = new Sound(fanfareSound);


        // イベント登録
        this.gameManager.addListener(window, "keydown", e => {
            if (!(e instanceof KeyboardEvent)) { return; }
            e.preventDefault()
            this.input_buffer.set(e.code, true);
        }, { passive: false });

        this.gameManager.addListener(window, "keyup", e => {
            if (!(e instanceof KeyboardEvent)) { return; }
            e.preventDefault();
            this.input_buffer.set(e.code, false);
        }, { passive: false });


        // 開発用
        // クリックしたところのWorldXYを表示する
        this.gameManager.addListener(this.canvas, "click", e => {
            if (!(e instanceof MouseEvent)) { return; }

            const rect = this.canvas.getBoundingClientRect();
            const point = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
            const display = <HTMLElement>document.getElementById("display");
            const wPoint = GToW(point, this.camera.point, this.canvas);
            display.innerHTML = `${wPoint.x}, ${wPoint.y}`;
        })
    }

    update() {
        // ゴールしたとき
        if (this.actor.hitGoal) {
            this.input_flag = false;
            this.goalText.isActive = true;
            this.actor.hitGoal = false;
            this.goalSound.oneShot();
        }


        // キー入力によるイベント
        if (this.input_flag) {
            if (this.input_buffer.get("Space")) {
                this.actor.charge();
            }
            if (!this.input_buffer.get("Space")) {
                this.actor.jump();
            }

            if (!this.input_buffer.get("ArrowRight") && !this.input_buffer.get("ArrowLeft")) {
                this.actor.stop();
            }
            if (this.input_buffer.get("ArrowRight")) {
                this.actor.walk("right");
                this.actor.setJumpDir("right");
            }
            if (this.input_buffer.get("ArrowLeft")) {
                this.actor.walk("left");
                this.actor.setJumpDir("left");
            }
            if (this.input_buffer.get("ArrowUp")) {
                this.actor.setJumpDir("center");
            }
        }

        // ギミック発動
        this.stage.triggerGimmicks([this.actor]);

        // 入力による更新
        this.actor.update();


        // 当たり判定
        this.collisionDetector.detectCollision(this.actor, Stage.getObjectsAroundCanvas<Obstacle>(this.stage.obstacles, this.camera.point, this.canvas));

        // カメラがActorを追いかけて移動する
        this.camera.chase(this.actor.point);

        // 環境音
        this.stage.playSound(this.camera.point, this.canvas);

        // 描画
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.clientWidth + 5, this.canvas.clientHeight);
        this.stage.draw(this.ctx, this.camera.point, this.canvas);
        this.actor.draw(this.ctx, this.camera.point, this.canvas);

        this.goalText.draw(this.ctx);
    }

}
