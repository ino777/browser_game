import { BaseScene } from "./base-scene";
import { TextObject, ButtonObject, Octpus, Ray, Alien, Sound } from "./model";
import { GameState, GameManager } from "./gamemanager";
import menuSound from "./sounds/menu.mp3";


// タイトル画面
export class TitleScene extends BaseScene {
    private titleText: TextObject;
    private startButton: ButtonObject;
    private octpus: Octpus;
    private ray: Ray;
    private alien: Alien;

    private menuSound: Sound;

    constructor(gameManager: GameManager, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        super(gameManager, canvas, ctx);
    }

    setup() {
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;
        this.titleText = new TextObject("Aim Alien", centerX, 150, 48);
        this.titleText.textAlign = "center";
        this.startButton = new ButtonObject("START", centerX, centerY, 200, 100, 50);

        this.octpus = new Octpus(centerX-100, 450, 30);
        this.ray = new Ray(centerX, 450, 30);
        this.alien = new Alien(centerX+100, 450, 30);

        this.menuSound = new Sound(menuSound);

        // イベント登録
        this.gameManager.addListener(this.canvas, "click", e => { this.clicked(e); })
        this.gameManager.addListener(this.canvas, "mousemove", e => { this.onMousemove(e); })
    }

    update() {
        this.titleText.draw(this.ctx);
        this.startButton.draw(this.ctx);

        this.octpus.animate();
        this.ray.animate();
        this.alien.animate();
        this.octpus.draw(this.ctx);
        this.ray.draw(this.ctx);
        this.alien.draw(this.ctx);
    }

    clicked(e: Event) {
        if (!(e instanceof MouseEvent)) { return; }
        const rect = this.canvas.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        if (this.startButton.testHit(point)) {
            this.menuSound.oneShot();
            this.startButton.clicked();
            // プレイシーンへ遷移
            this.gameManager.setState("Play");
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
        if (this.startButton.testHit(point)) {
            this.startButton.hoverOver();
        } else {
            this.startButton.hoverOut();
        }
    }

}