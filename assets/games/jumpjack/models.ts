import { v4 as uuidv4 } from "uuid";

/**
 * Worldベクトル
 * ゲーム全体のワールド内でのベクトル
 * x方向：右, y方向: 上
 */
interface WorldXY {
    x: number;
    y: number;
}


// 平行移動
const translateXY = (vec: WorldXY, dx: number, dy: number): WorldXY => {
    return { x: vec.x + dx, y: vec.y + dy };
}

// 回転操作
const rotateXY = (vec: WorldXY, angle: number): WorldXY => {
    return {
        x: Math.cos(angle) * vec.x - Math.sin(angle) * vec.y,
        y: Math.sin(angle) * vec.x + Math.cos(angle) * vec.y
    }
}

/**
 * Graphicベクトル
 * Canvas内のベクトル
 * x方向: 右, y方向：下
 */
interface GraphicXY {
    x: number;
    y: number;
}

/**
 * Worldベクトル→Graphicベクトル　
 * @param point 座標変換するベクトル
 * @param view カメラのWorldベクトル, Canvasの中心点となる
 * @param canvas canvas element
 */
export const WToG = (point: WorldXY, view: WorldXY, canvas: HTMLCanvasElement): GraphicXY => {
    const gx = canvas.clientWidth / 2 - (view.x - point.x);
    const gy = canvas.clientHeight / 2 + (view.y - point.y);
    return { x: gx, y: gy };
}

/**
 * Graphicベクトル→Worldベクトル
 * @param point 座標変換するベクトル
 * @param view カメラのWorldベクトル
 * @param canvas canvas element
 */
export const GToW = (point: GraphicXY, view: WorldXY, canvas: HTMLCanvasElement): WorldXY => {
    const wx = view.x - canvas.clientWidth / 2 + point.x;
    const wy = view.y + canvas.clientHeight / 2 - point.y;
    return { x: wx, y: wy };
}

export type direction = "left" | "top" | "right" | "bottom";


/**
 * カメラ
 */
export class Camera {
    point: WorldXY;
    heightInterval: number;
    private origPoint: WorldXY;
    constructor(point: WorldXY, canvas: HTMLCanvasElement) {
        this.point = point;
        this.heightInterval = canvas.clientHeight;
        this.origPoint = {
            x: point.x,
            y: point.y
        };
    }

    move(dx: number, dy: number) {
        this.point.x += dx;
        this.point.y += dy;
    }

    chase(point: WorldXY) {
        const yy = Math.floor(point.y / this.heightInterval) * this.heightInterval;
        this.point.y = this.origPoint.y + yy;
    }
}

/**
 * テキストオブジェクト
 */
export class TextObject {
    point: GraphicXY;
    text: string;
    size: number;
    isActive: boolean = true;
    constructor(point: GraphicXY, text: string, size: number) {
        this.point = point;
        this.text = text;
        this.size = size;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) { return; }
        ctx.save();
        ctx.font = this.size + "pt PixelMplus12";
        ctx.fillStyle = "black";
        ctx.fillText(this.text, this.point.x, this.point.y);
        ctx.restore();
    }
}


/**
 * Base object
 */
abstract class BaseObject {
    point: WorldXY;
    protected isActive: boolean;

    constructor(point: WorldXY, isActive = true) {
        this.point = point;
        this.isActive = isActive;
    }

    // 描画
    abstract draw(ctx: CanvasRenderingContext2D, view: WorldXY, canvas: HTMLCanvasElement): void;
}


/**
 * Collision Rectangle
 */
interface ICollisionRect {
    w: number;
    h: number;
}

/**
 * ICollisionRect用の型ガード
 */

const isICollisionRect = (arg: unknown): arg is ICollisionRect => {
    return (typeof arg == "object" &&
        arg != null &&
        typeof (arg as ICollisionRect).w == "number" &&
        typeof (arg as ICollisionRect).h == "number");
}


export interface ColliderOptions {
    tag?: string;
    bounciness?: number;
}

export abstract class CollideObject extends BaseObject {
    id: string;
    tag = "";
    bounciness = 1;
    width: number;
    height: number;
    angle: number;
    // velocity
    vx = 0;
    vy = 0;
    collisionRect: ICollisionRect;
    constructor(point: WorldXY, w: number, h: number, options?: ColliderOptions) {
        super(point);
        this.id = uuidv4();
        if (options) {
            this.tag = options.tag != undefined ? options.tag : "";
            this.bounciness = options.bounciness != undefined ? options.bounciness : 1;
        }
        this.width = w;
        this.height = h;
        this.collisionRect = {
            w: this.width,
            h: this.height,
        }
    }
    // 接触したとき
    abstract onCollisionEnter(obj: CollideObject, dir: direction): void;
    // 接触中
    abstract onCollision(obj: CollideObject, dir: direction): void;
    // 接触が離れたとき
    abstract onCollisionExit(obj: CollideObject, dir: direction): void;

    get left() {
        return this.point.x - this.width / 2;
    }
    get top() {
        return this.point.y + this.height / 2;
    }
    get right() {
        return this.point.x + this.width / 2;
    }
    get bottom() {
        return this.point.y - this.height / 2;
    }
}


/**
 * Animator
 */
class Animator {
    protected animationImages: HTMLImageElement[];
    protected currentImage: HTMLImageElement;
    protected duration: number;
    protected loop: boolean;
    protected animationIndex: number = 0;
    protected currentFrame: number = 0;


    constructor(imagePaths: string[], duration = 60, loop = true) {
        this.animationImages = [];
        imagePaths.forEach(p => {
            let image = new Image();
            image.src = p;
            this.animationImages.push(image);
        })
        this.currentImage = this.animationImages[0];
        this.duration = duration;
        this.loop = loop;

    }

    getCurrentImage(): HTMLImageElement {
        return this.currentImage;
    }

    animate() {
        this.currentFrame += 1;
        if (this.currentFrame > this.duration) {
            this.animationIndex = (this.animationIndex < this.animationImages.length - 1) ? this.animationIndex + 1 : 0;
            this.currentImage = this.animationImages[this.animationIndex];
            if (this.loop) {
                this.currentFrame = 0;
            }
        }
    }
}

/**
 * Sound
 */

export class Sound {
    protected audio: HTMLAudioElement;
    protected isLoop: boolean;

    constructor(src: string) {
        this.audio = new Audio(src);
    }

    oneShot() {
        this.audio.pause();
        this.audio.currentTime = 0.0;
        this.audio.play();
    }

    startLoop() {
        if (this.isLoop) { return; }
        this.audio.play();
        this.audio.loop = true;
        this.isLoop = true;
    }
    stopLoop() {
        this.audio.loop = false;
        this.audio.pause();
        
        this.isLoop = false;
    }
}


import actorStopRightImage from "./image/actor_stop_right.png";
import actorStopLeftImage from "./image/actor_stop_left.png";
import actorRightImage from "./image/actor_right.png";
import actorRightImage1 from "./image/actor_right_1.png";
import actorLeftImage from "./image/actor_left.png";
import actorLeftImage1 from "./image/actor_left_1.png";
import actorJumpRightImage from "./image/actor_jump_right.png";
import actorJumpLeftImage from "./image/actor_jump_left.png";
import actorFallRightImage from "./image/actor_fall_right.png";
import actorFallLeftImage from "./image/actor_fall_left.png";
import actorChargeImage from "./image/actor_charge.png";

import actorBoundSound from "./sounds/bound.mp3";
import actorJumpupSound from "./sounds/jumpup.mp3";
import actorLandSound from "./sounds/land.mp3";



export class Actor extends CollideObject {
    // 接地しているか
    isGround = false;
    // 止まっているか
    isStop = true;
    // 着地中か
    isLand = false;
    // 壁に跳ね返ったか
    isBounced = false;

    // ゴールしたか
    hitGoal = false;

    // ジャンプチャージ
    protected jumpCharge = 0;
    // ジャンプチャージ中
    protected isCharge = false;
    // ジャンプの方向
    protected jumpDirection: "left" | "center" | "right" = "center";

    // キャラの向き
    protected direction: "left" | "right" = "right";

    // アニメーター
    protected stopRightAnimator: Animator;
    protected stopLeftAnimator: Animator;
    protected walkRightAnimator: Animator;
    protected walkLeftAnimator: Animator;
    protected jumpRightAnimator: Animator;
    protected jumpLeftAnimator: Animator;
    protected fallRightAnimator: Animator;
    protected fallLeftAnimator: Animator;
    protected chargeAnimator: Animator;

    // 音声
    protected boundSound: Sound;
    protected jumpupSound: Sound;
    protected landSound: Sound;

    // 各種定数
    readonly gravity = 1;
    readonly airResistance = 0.7;
    readonly maxVx = 24;
    readonly maxVy = 24;
    readonly maxJumpCharge = 36;

    constructor(point: WorldXY, w: number, h: number, options?: ColliderOptions) {
        super(point, w, h, options);
        this.stopRightAnimator = new Animator([actorStopRightImage]);
        this.stopLeftAnimator = new Animator([actorStopLeftImage]);
        this.walkRightAnimator = new Animator([actorRightImage, actorRightImage1], 30);
        this.walkLeftAnimator = new Animator([actorLeftImage, actorLeftImage1], 30);
        this.jumpRightAnimator = new Animator([actorJumpRightImage]);
        this.jumpLeftAnimator = new Animator([actorJumpLeftImage]);
        this.fallRightAnimator = new Animator([actorFallRightImage]);
        this.fallLeftAnimator = new Animator([actorFallLeftImage]);
        this.chargeAnimator = new Animator([actorChargeImage]);

        this.boundSound = new Sound(actorBoundSound);
        this.jumpupSound = new Sound(actorJumpupSound);
        this.landSound = new Sound(actorLandSound);
    }

    draw(ctx: CanvasRenderingContext2D, view: WorldXY, canvas: HTMLCanvasElement) {
        if (!this.isActive) { return; }
        const gPoint = WToG(this.point, view, canvas);
        let animator = this.getCurrentAnimator();
        ctx.save();
        ctx.drawImage(animator.getCurrentImage(), gPoint.x - this.width / 2, gPoint.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }

    // 現在の行動に応じてAnimatorを取得する
    getCurrentAnimator(): Animator {
        if (this.isGround) {
            // 接地しているとき
            if (this.isCharge) {
                // チャージ中
                return this.chargeAnimator;
            }
            if (this.isStop) {
                // 止まっている時
                return (this.direction == "right" ? this.stopRightAnimator : this.stopLeftAnimator);
            }
            // 歩いている時
            return (this.direction == "right" ? this.walkRightAnimator : this.walkLeftAnimator);
        } else {
            // 空中にいるとき
            if (this.vy < 0) {
                // 落下中
                return (this.direction == "right" ? this.fallRightAnimator : this.fallLeftAnimator);
            }
            if (this.jumpDirection == "right") {
                // 右向きにジャンプ
                return this.jumpRightAnimator;
            } else if (this.jumpDirection == "left") {
                // 左向きにジャンプ
                return this.jumpLeftAnimator;
            }
            // 真ん中ジャンプ
            return (this.direction == "right" ? this.jumpRightAnimator : this.jumpLeftAnimator);
        }
    }

    update() {
        // ジャンプ中あるいは接地してないときに重力がかかる
        if (!this.isGround) {
            this.vy -= this.gravity;
            if (this.vy < 0) {
                this.vy += this.airResistance;
            }
        } else {
            this.vy = 0;
        }

        // 速度を制限
        this.vx = Actor.limitV(this.vx, this.maxVx);
        this.vy = Actor.limitV(this.vy, this.maxVy);

        // 移動
        this.point.x += this.vx;
        this.point.y += this.vy;

        // アニメーション更新
        // 歩いている時のみ
        if (this.isGround && this.vx != 0) {
            if (this.direction == "right") { this.walkRightAnimator.animate(); }
            else { this.walkLeftAnimator.animate(); }
        }
    }

    // 接触始まり
    onCollisionEnter(obj: CollideObject, dir: direction) {
        console.log(obj.id, dir);
        // 位置調整
        if (dir == "left") {
            if (this.vx <= 0 && this.point.x <= obj.right + this.width / 2) {
                this.point.x = obj.right + this.width / 2;
                // 空中の跳ね返りは1回のみ
                if (!this.isGround && !this.isBounced) {
                    this.vx *= -1 * this.bounciness * obj.bounciness;
                    this.isBounced = true;
                    this.boundSound.oneShot();
                } else {
                    this.vx = 0;
                }
            }


        }
        if (dir == "right") {
            if (this.vx >= 0 && this.point.x >= obj.left - this.width / 2) {
                this.point.x = obj.left - this.width / 2;
                // 空中の跳ね返りは1回のみ
                if (!this.isGround && !this.isBounced) {
                    this.vx *= -1 * this.bounciness * obj.bounciness;
                    this.isBounced = true
                    this.boundSound.oneShot();
                } else {
                    this.vx = 0;
                }
            }


        }
        if (dir == "top") {
            if (this.vy >= 0 && this.point.y + this.height / 2 >= obj.bottom) {
                this.point.y = obj.bottom - this.height / 2;
                this.vy = 0;
                if (!this.isGround) {
                    this.boundSound.oneShot();
                }
            }

        }
        if (dir == "bottom") {
            if (this.vy <= 0 && this.point.y <= obj.top + this.height / 2) {
                this.point.y = obj.top + this.height / 2;
            }

            this.vx = 0;
            this.isGround = true;
            this.isLand = true;
            this.landSound.oneShot();
            this.isBounced = false;
            this.jumpDirection = "center";

            if (obj.tag == "goal") {
                this.hitGoal = true;
            }
        }
    }

    // 接触中
    onCollision(obj: CollideObject, dir: direction) {
        if (dir == "left") {
            if (this.vx <= 0 && this.point.x <= obj.right + this.width / 2) {
                this.point.x = obj.right + this.width / 2;
            }
        }
        if (dir == "right") {
            if (this.vx >= 0 && this.point.x >= obj.left - this.width / 2) {
                this.point.x = obj.left - this.width / 2
            }
        }
        if (dir == "top") {
            if (this.vy >= 0 && this.point.y >= obj.bottom - this.height / 2) {
                this.point.y = obj.bottom - this.height / 2;
            }
        }
        if (dir == "bottom") {
            if (this.vy <= 0 && this.point.y <= obj.top + this.height / 2) {
                this.point.y = obj.top + this.height / 2;
            }
        }
    }

    // 接触終わり
    onCollisionExit(obj: CollideObject, dir: direction) {
        // 地面から離れたとき
        if (dir == "bottom") {
            this.isGround = false;
        }

    }

    // 歩く
    walk(dir: "right" | "left") {
        if (!this.isGround) { return; }
        if (this.isCharge) { return; }
        this.isStop = false;
        this.direction = dir;
        const pm = dir == "right" ? 1 : -1;
        this.vx = pm * 4.5;
    }

    // 止まる
    stop() {
        if (!this.isGround) { return; }
        this.isStop = true;
        this.vx = 0;
    }

    // ジャンプチャージ
    charge() {
        if (!this.isGround) { return; }
        this.vx = 0;
        if (this.jumpCharge < this.maxJumpCharge) {
            this.jumpCharge += 1;
        }
        this.isCharge = true;
    }

    // ジャンプの方向を決める
    setJumpDir(dir: "right" | "center" | "left") {
        if (!this.isCharge) { return; }
        this.jumpDirection = dir;
    }

    // ジャンプ
    jump() {
        if (!this.isCharge) { return; }
        if (!this.isGround) { return; }
        this.isGround = false;
        this.isCharge = false;
        switch (this.jumpDirection) {
            case "left":
                this.vx = -1.2 * Math.sqrt(this.jumpCharge);
                this.direction = "left";
                break;
            case "center":
                this.vx = 0;
                break;
            case "right":
                this.vx = 1.2 * Math.sqrt(this.jumpCharge);
                this.direction = "right";
                break;
        }
        this.vy = 3.7 * Math.sqrt(this.jumpCharge);
        this.jumpCharge = 0;
        this.jumpupSound.oneShot();
    }


    // 速度を制限
    static limitV(v: number, max: number): number {
        // 速度の限界値
        if (Math.abs(v) > max) {
            const pm = v >= 0 ? 1 : -1;
            v = pm * max;
        }
        return v;
    }
}


import groundImage from "./image/block.png";

// 障害物の引数
export interface ObstacleParams {
    point: WorldXY;
    w: number;
    h: number;
    type?: string;
    options?: ColliderOptions;
}

/**
 * 障害物
 */
export class Obstacle extends CollideObject {
    private image: HTMLImageElement;

    constructor(params: ObstacleParams) {
        super(params.point, params.w, params.h, params.options);
        this.image = new Image();
        this.image.src = groundImage;
    }

    draw(ctx: CanvasRenderingContext2D, view: WorldXY, canvas: HTMLCanvasElement) {
        if (!this.isActive) { return; }
        const gPoint = WToG(this.point, view, canvas);

        if (gPoint.y + this.height / 2 < 0 || gPoint.y - this.height / 2 > canvas.clientHeight) { return; }
        ctx.save();
        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillRect(gPoint.x - this.width / 2, gPoint.y - this.height / 2, this.width, this.height);
        // this.drawImageRepeat(ctx, this.image, gPoint, 40, 40);
        ctx.restore();
    }


    drawImageRepeat(ctx: CanvasRenderingContext2D, img: HTMLImageElement, point: WorldXY | GraphicXY, imgWidth: number, imgHeight: number) {
        const widthNum = Math.floor(this.width / imgWidth);
        const heightNum = Math.floor(this.height / imgHeight);
        for (let i = 0; i <= widthNum; i++) {
            for (let j = 0; j <= heightNum; j++) {
                let distWidth = imgWidth;
                let distHeight = imgHeight;
                if (i == widthNum) {
                    distWidth = this.width - i * imgWidth;
                }
                if (j == heightNum) {
                    distHeight = this.height - j * imgHeight;
                }
                ctx.drawImage(
                    img,
                    point.x - this.width / 2 + i * imgWidth,
                    point.y - this.height / 2 + j * imgHeight,
                    distWidth, distHeight)
            }
        }
    }


    onCollisionEnter(obj: CollideObject, dir: direction) {
    }

    onCollision(obj: CollideObject, dir: direction) {

    }

    onCollisionExit(obj: CollideObject, dir: direction) {

    }
}


export interface StageGimmickParams {
    point: WorldXY;
}

export abstract class StageGimmick extends BaseObject {
    width: number;
    height: number;
    constructor(point: WorldXY, w: number, h: number) {
        super(point);
        this.width = w;
        this.height = h;
    }
    draw(ctx: CanvasRenderingContext2D, view: WorldXY, canvas: HTMLCanvasElement) { }
    playSound(view: WorldXY, canvas: HTMLCanvasElement) { }
    abstract trigger(obj: CollideObject): void;
    abstract update(): void;
}


export interface WindParams {
    point: WorldXY;
    w: number;
    h: number;
    strength: number;
}

import windImage from "./image/wind.png";
import windSound from "./sounds/wind.mp3";

/**
 * ステージギミック（風）
 */
export class Wind extends StageGimmick {
    strength: number;
    private tick: number;
    image: HTMLImageElement;
    offset: GraphicXY;
    sound: Sound;
    constructor(params: WindParams) {
        super(params.point, params.w, params.h);
        this.strength = params.strength;
        this.tick = 0;
        this.image = new Image();
        this.image.src = windImage;
        this.offset = { x: 0, y: 0 }
        this.sound = new Sound(windSound);
    }

    draw(ctx: CanvasRenderingContext2D, view: WorldXY, canvas: HTMLCanvasElement) {
        if (!this.isActive) { return; }
        const gPoint = WToG(this.point, view, canvas);
        let dx = 3000 - this.offset.x;
        while (dx < 0) {
            dx += 3000;
        }
        ctx.save();
        ctx.drawImage(this.image, dx, 0, this.width, this.height, gPoint.x - this.width / 2, gPoint.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }

    playSound(view: WorldXY, canvas: HTMLCanvasElement) {
        if (this.point.y >= view.y - canvas.clientHeight / 2 && this.point.y <= view.y + canvas.clientHeight / 2) {
            this.sound.startLoop();
        } else {
            this.sound.stopLoop();
        }
    }

    update() {
        this.tick += Math.PI / 180 / 3;
        if (this.tick > 2 * Math.PI) { this.tick = 0; }
        const pm = Math.sin(this.tick);
        this.offset.x += pm * this.strength * 200;
    }

    trigger(obj: Actor) {
        this.blow(obj);
    }

    blow(obj: Actor) {
        const pm = Math.sin(this.tick);
        obj.vx += pm * this.strength;
    }


}



/**
 * ステージ
 */
export class Stage extends BaseObject {
    obstacles: Obstacle[];
    gimmicks: StageGimmick[];
    private tick: number;
    constructor(obstacles: Obstacle[], gimmicks: StageGimmick[]) {
        super({ x: 0, y: 0 });
        this.obstacles = obstacles;
        this.gimmicks = gimmicks;
    }

    addObstacle(paramsList: ObstacleParams[]) {
        paramsList.forEach(p => {
            this.obstacles.push(new Obstacle(p));
        });
    }

    draw(ctx: CanvasRenderingContext2D, view: WorldXY, canvas: HTMLCanvasElement) {
        const gimmicks = Stage.getObjectsInCanvas(this.gimmicks, view, canvas);
        gimmicks.forEach(g => {
            g.draw(ctx, view, canvas);
        })

        const obstacles = Stage.getObjectsAroundCanvas(this.obstacles, view, canvas);
        obstacles.forEach(obst => {
            obst.draw(ctx, view, canvas);
        })

    }

    playSound(view: WorldXY, canvas: HTMLCanvasElement) {
        this.gimmicks.forEach(g => {
            g.playSound(view, canvas);
        })
    }

    triggerGimmicks(objs: Actor[]) {
        this.gimmicks.forEach(g => {
            g.update();
            objs.forEach(o => {
                if (g.point.x - g.width / 2 < o.point.x && g.point.x + g.width / 2 > o.point.x &&
                    g.point.y - g.height / 2 < o.point.y && g.point.y + g.height / 2 > o.point.y) {
                    g.trigger(o);
                }
            })
        })
    }

    // ゲーム画面内のオブジェクトのみを集める
    static getObjectsInCanvas<T extends BaseObject>(objs: T[], view: WorldXY, canvas: HTMLElement) {
        return objs.filter(o => {
            return o.point.y >= view.y - canvas.clientHeight / 2 && o.point.y <= view.y + canvas.clientHeight / 2;
        })
    }

    // ゲーム画面内＋上下一画面分のオブジェクトのみを集める
    static getObjectsAroundCanvas<T extends BaseObject>(objs: T[], view: WorldXY, canvas: HTMLCanvasElement) {
        return objs.filter(o => {
            return o.point.y >= view.y - 3 * canvas.clientHeight / 2 && o.point.y <= view.y + 3 * canvas.clientHeight / 2;
        })
    }
}


/**
 * 当たり判定を検出するクラス
 */
export class CollisionDetector {
    // 接触中のオブジェクトを管理するテーブル
    protected hitObjects: { [id: string]: { [other: string]: { hit: boolean, dir: direction } } };

    constructor() {
        this.hitObjects = {};
    }

    // 全てのオブジェクトobstsとの当たり判定をとる
    detectCollision(obj: CollideObject, obsts: CollideObject[]) {
        // 総当たり
        for (let obst of obsts) {
            // 自分自身のときはパス
            if (obj.id == obst.id) { continue; }


            // テーブルにオブジェクトの情報がなければ追加する
            const objHits = this.hitObjects[obj.id];
            const obstHits = this.hitObjects[obst.id];
            if (objHits == undefined) { this.hitObjects[obj.id] = {} }
            if (obstHits == undefined) { this.hitObjects[obst.id] = {} }

            // 既に接触中かのフラグ
            const hit = this.hitObjects[obj.id][obst.id] != undefined && this.hitObjects[obj.id][obst.id].hit &&
                this.hitObjects[obst.id][obj.id] != undefined && this.hitObjects[obst.id][obj.id].hit;

            // const distance = { x: Math.abs(obj.point.x - obst.point.x), y: Math.abs(obj.point.y - obst.point.y) };
            // const totalSize = { x: (obj.collisionRect.w + obst.collisionRect.w) / 2, y: (obj.collisionRect.h + obst.collisionRect.h) / 2 };


            // どこの辺で当たっているか
            const dir = this.getCollisionDirection(obj, obst);

            // 当たっている時
            if (dir != undefined) {


                if (hit) {
                    // 既に接触中ならばonCollisionを呼び出す
                    obj.onCollision(obst, dir);
                    obst.onCollision(obj, dir);
                    this.hitObjects[obj.id][obst.id] = { hit: true, dir: dir };
                    this.hitObjects[obst.id][obj.id] = { hit: true, dir: dir };
                } else {
                    // 前フレームで接触していなければonCollisionEnterを呼び出す
                    obj.onCollisionEnter(obst, dir);
                    obst.onCollisionEnter(obj, dir);
                    this.hitObjects[obj.id][obst.id] = { hit: true, dir: dir };
                    this.hitObjects[obst.id][obj.id] = { hit: true, dir: dir };
                }

            } else {
                // 当たっていないとき
                if (hit) {
                    // 既に接触中ならばonCollisionExitを呼び出す
                    const dir = this.hitObjects[obj.id][obst.id].dir;
                    obj.onCollisionExit(obst, dir);
                    obst.onCollisionExit(obj, dir);
                    this.hitObjects[obj.id][obst.id] = { hit: false, dir: dir }
                    this.hitObjects[obst.id][obj.id] = { hit: false, dir: dir }
                }
            }


        }
    }

    // どこの辺で当たっているかを取得する
    getCollisionDirection(obj: CollideObject, other: CollideObject) {
        // 上の壁に当たる
        let hitTop = obj.vy >= 0 && obj.bottom < other.bottom && obj.top >= other.bottom && obj.top < other.top &&
            obj.left < other.right && obj.right > other.left;

        // 下の壁にあたる
        let hitBottom = obj.vy <= 0 && obj.top > other.top && obj.bottom <= other.top && obj.bottom > other.bottom &&
            obj.left < other.right && obj.right > other.left;

        // 左の壁に当たる
        let hitLeft = obj.vx <= 0 && obj.right > other.right && obj.left <= other.right && obj.left > other.left &&
            obj.top > other.bottom && obj.bottom < other.top;

        // 右の壁に当たる
        let hitRight = obj.vx >= 0 && obj.left < other.left && obj.right >= other.left && obj.right < other.right &&
            obj.top > other.bottom && obj.bottom < other.top;

        // otherの4隅で衝突したときにどちらを判定とするか
        // 当たっている辺の長さが長い方を当たり判定とする
        if (hitRight && hitBottom) {
            const rightLength = obj.height - (obj.top - other.top);
            const bottomLength = obj.width - (other.left - obj.left);
            hitRight = rightLength > bottomLength;
            hitBottom = rightLength <= bottomLength;
        } else if (hitLeft && hitBottom) {
            const leftLength = obj.height - (obj.top - other.top);
            const bottomLength = obj.width - (obj.right - other.right);
            hitLeft = leftLength > bottomLength;
            hitBottom = leftLength <= bottomLength;
        } else if (hitLeft && hitTop) {
            const leftLength = obj.height - (other.bottom - obj.bottom);
            const topLength = obj.width - (obj.right - other.right);
            hitLeft = leftLength > topLength;
            hitTop = leftLength <= topLength;
        } else if (hitRight && hitTop) {
            const rightLength = obj.height - (other.bottom - obj.bottom);
            const topLength = obj.width - (other.left - obj.left);
            hitRight = rightLength > topLength;
            hitTop = rightLength <= topLength;
        }

        let dir: direction | undefined;
        if (hitLeft) { dir = "left" }
        else if (hitTop) { dir = "top" }
        else if (hitRight) { dir = "right" }
        else if (hitBottom) { dir = "bottom" }
        return dir;
    }
}