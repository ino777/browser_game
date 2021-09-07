/**
 * Base object
 */
abstract class BaseObject {
    protected x: number;
    protected y: number;
    protected isActive: boolean;

    constructor(x: number, y: number, isActive = true) {
        this.x = x;
        this.y = y;
        this.isActive = isActive;
    }

    // 描画
    abstract draw(ctx: CanvasRenderingContext2D): void;
}


/**
 * Click interface
 */
interface IClick {
    // クリック判定
    testHit(point:{x:number, y:number}): boolean;
    // クリック時処理
    clicked(): void;
}

/**
 * Animate interface
*/
interface IAnimate {
    animator: Animator;
    animate(): void;
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


/*
** Targetクラス
*/
export class Target extends BaseObject implements IAnimate, IClick {
    protected r: number;
    protected speedX: number = 0;
    protected speedY: number = 0;
    animator: Animator;

    constructor(x: number, y: number, r: number, imagePaths: string[]) {
        super(x, y);
        this.r = r;
        this.animator = new Animator(imagePaths);
    }

    // 描画
    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) { return }
        ctx.save();
        ctx.drawImage(this.animator.getCurrentImage(), this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
        ctx.restore();
    }

    // アニメーション
    animate() {
        this.animator.animate();
    }

    // 移動
    move(dx: number, dy: number) {
        this.speedX = dx;
        this.speedY = dy;
        this.x += this.speedX;
        this.y += this.speedY;
    }

    // 反射移動
    reflectMove(top: number, bot: number, left: number, right: number) {
        this.speedX = this.speedX || -3 + 6 * Math.random();
        this.speedY = this.speedY || -3 + 6 * Math.random();

        if (this.y <= top + this.r || this.y >= bot - this.r) {
            this.speedY *= -1;
        }
        if (this.x <= left + this.r || this.x >= right - this.r) {
            this.speedX *= -1;
        }
        this.move(this.speedX, this.speedY);
    }

    testHit(point:{x:number, y:number}) {
        if (!this.isActive) { return false }

        const dist = Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
        return dist < this.r;
    }

    clicked() {
        this.isActive = false;
    }

}



import oct_image1 from "./images/octpus_white.png";
import oct_image2 from "./images/octpus_white_1.png";

/**
 * Octpus
 */
export class Octpus extends Target {
    constructor(x: number, y: number, r: number) {
        const imagePaths = [oct_image1, oct_image2];
        super(x, y, r, imagePaths);
    }
}

import ray_image1 from "./images/ray_white.png";
import ray_image2 from "./images/ray_white_1.png";

/**
 * Ray
 */
export class Ray extends Target {
    constructor(x: number, y: number, r: number) {
        const imagePaths = [ray_image1, ray_image2];
        super(x, y, r, imagePaths);
    }
}


import alien_image1 from "./images/alien_white.png";
import alien_image2 from "./images/alien_white_1.png";

/**
 * alien
 */

export class Alien extends Target {
    constructor(x: number, y: number, r: number) {
        const imagePaths = [alien_image1, alien_image2];
        super(x, y, r, imagePaths);
    }
}


/*
** Button
*/
export class ButtonObject extends BaseObject implements IClick {
    text: string;
    protected size: number;
    protected width: number;
    protected height: number;
    color: string;
    textColor: string;
    edgeColor: string;

    // もともとの値
    protected origW: number;
    protected origH: number;

    constructor(text: string, x: number, y: number, w: number, h: number, size: number, color = "rgb(15, 15, 20)", textColor = "white", edgeColor = "white") {
        super(x, y);
        this.text = text;
        this.size = size;
        this.width = w;
        this.height = h;
        this.color = color;
        this.textColor = textColor;
        this.edgeColor = edgeColor;

        this.origW = this.width;
        this.origH = this.height;
    }

    // 描画
    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) { return }
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.strokeStyle = this.edgeColor;
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.fillStyle = this.textColor;
        ctx.textAlign = "center";
        ctx.font = "bold " + this.size + "px" + " PixelMplus12";
        ctx.fillText(this.text, this.x, this.y + this.size / 3);
        ctx.restore();
    }

    // マウスが重なったとき
    hoverOver() {
        this.width = this.origW + 5;
        this.height = this.origH + 5;
    }

    // マウスが離れたとき
    hoverOut() {
        this.width = this.origW;
        this.height = this.origH;
    }

    testHit(point:{x:number, y:number}) {
        if (!this.isActive) { return false }

        return (this.x - this.width / 2 <= point.x && point.x <= this.x + this.width / 2)
            && (this.y - this.height / 2 <= point.y && point.y <= this.y + this.height / 2);
    }

    clicked() {
    }
}


/*
** TextObject
*/
export class TextObject extends BaseObject {
    text: string;
    size: number;
    color: string;
    textAlign: CanvasTextAlign;
    

    constructor(text: string | number, x: number, y: number, size=26, color="white", textAlign:CanvasTextAlign="start") {
        super(x, y);
        this.text = text.toString();
        this.size = size;
        this.color = color;
        this.textAlign = textAlign;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) { return }
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.textAlign = this.textAlign;
        ctx.font = "bold " + this.size + "px" + " PixelMplus12";
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }

}


/**
 * Sound
 */

export class Sound {
    protected audio: HTMLAudioElement;

    constructor(src: string) {
        this.audio = new Audio(src);
    }

    oneShot() {
        this.audio.pause();
        this.audio.currentTime = 0.0;
        this.audio.play();
    }
}


/**
 * Effect
 */

export abstract class Effect {
    protected x: number;
    protected y: number;
    protected isActive: boolean;
    protected duration: number;  // エフェクトの長さ
    protected life: number;     // 残りの寿命

    constructor(x: number, y: number, duration: number) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.life = duration;
        this.isActive = true;
    }

    // 描画
    abstract render(ctx: CanvasRenderingContext2D): void;

    // エフェクトの更新
    abstract update(): void;
}

/**
 * RectEffect
 */

export class RectEffect extends Effect {
    protected width: number;
    protected height: number;
    protected color: string;

    constructor(x: number, y: number, duration: number, w: number, h: number, color: string) {
        super(x, y, duration);
        this.width = w;
        this.height = h;
        this.color = color;
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) { return }
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }

    update() {
        if (!this.isActive) { return }

        if (this.life <= 0) {
            this.isActive = false;
            return;
        }

        this.life -= 1;
    }
}

/***
 * CircleEffect
 */
export class CircleEffect extends Effect {
    protected r: number;
    protected size: number;
    protected color: string;

    constructor(x: number, y: number, duration: number, size: number, color: string) {
        super(x, y, duration);
        this.r = size;
        this.size = size;
        this.color = color;
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) { return }
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);

        if (this.life > this.duration / 2) {
            // 前半
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            // 後半
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
        ctx.restore();
    }

    update() {
        if (!this.isActive) { return }

        if (this.life <= 0) {
            this.isActive = false;
            return;
        }

        if (this.life > this.duration / 2) {
            // 前半
            this.r -= 2 * this.size / this.duration;
        } else {
            // 後半
            this.r += 2 * this.size / this.duration;
        }

        this.life -= 1;
    }
}

/***
 * ExplosionEffect
 */
export class ExplosionEffect extends Effect {
    protected r: number;
    protected size: number;
    protected color: string;
    protected particles: CircleEffect[];

    constructor(x: number, y: number, duration: number, size: number, color: string, maxParticles: number) {
        super(x, y, duration);
        this.r = size;
        this.size = size;
        this.color = color;

        this.particles = [];
        for (let i = 0; i < maxParticles; i++) {
            const xx = this.x + (2 * Math.random() - 1) * this.size;
            const yy = this.y + (2 * Math.random() - 1) * this.size;
            this.particles.push(new CircleEffect(xx, yy, this.duration, this.size, this.color));
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) { return }
        this.particles.forEach(p => {
            p.render(ctx);
        })
    }

    update() {
        if (!this.isActive) { return }
        this.particles.forEach(p => {
            p.update();
        })
    }
}