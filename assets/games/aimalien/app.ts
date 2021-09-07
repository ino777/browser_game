import { GameScene } from "./game-scene";
import "./style/style.css";
import "./fonts/PixelMplus12-Regular.ttf";

const main = () => {
    const canvas = <HTMLCanvasElement> document.getElementById("mainCanvas");
    const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

    const container = <HTMLElement> document.getElementById("mainContainer");

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const gameScene = new GameScene(canvas, ctx);
    gameScene.start();
};

window.onload = main;