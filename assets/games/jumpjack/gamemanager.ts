import { CollideObject } from "./models";
import { BaseScene } from "./base-scene";

export type GameState = "Play";


export class GameManager {
    private state: GameState;
    onTransition: boolean;

    private eventList: {
        target: EventTarget,
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | AddEventListenerOptions
    }[];
    private eventKey: number = 0;


    info: { [key: string]: any };


    constructor(state: GameState) {
        this.state = state;
        this.onTransition = true;

        this.info = {};

        this.eventList = [];
    }

    getState(): GameState {
        return this.state;
    }

    setState(state: GameState) {
        this.state = state;
        this.onTransition = true;
    }

    addListener(target: EventTarget, type: string, listener: EventListener | EventListenerObject, options?: boolean | AddEventListenerOptions): number {
        target.addEventListener(type, listener, options);
        this.eventList[this.eventKey] = {
            target: target,
            type: type,
            listener: listener,
        }
        return this.eventKey++;
    }

    removeListener(key: number) {
        if (key in this.eventList) {
            const e = this.eventList[key];
            e.target.removeEventListener(e.type, e.listener, e.options);
        }
    }

    removeAllListener() {
        this.eventList.forEach(e => {
            e.target.removeEventListener(e.type, e.listener);
        });
        this.eventKey = 0;
    }



}


