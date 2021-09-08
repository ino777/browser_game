export type GameState = "Title" | "Play" | "Result";
export type GameLevel = "Normal" | "Hard";

class GameScore {
    score: number;
    time: number;
    killCount: number;
    clickCount: number;
    hitCount: number;
    failCount: number;
    bonus: number;
}

export class GameManager {
    private state: GameState;
    onTransition: boolean;

    private eventList: {
        target: EventTarget,
        type: string,
        listener: EventListener | EventListenerObject,
    }[];
    private eventKey: number = 0;

    private level: GameLevel;

    score: GameScore;
    info: { [key: string]: any };


    constructor(state: GameState) {
        this.state = state;
        this.onTransition = true;
        this.level = "Normal";

        this.score = new GameScore();
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

    addListener(target: EventTarget, type: string, listener: EventListener | EventListenerObject): number {
        target.addEventListener(type, listener);
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
            e.target.removeEventListener(e.type, e.listener);
        }
    }

    removeAllListener() {
        this.eventList.forEach(e => {
            e.target.removeEventListener(e.type, e.listener);
        });
        this.eventKey = 0;
    }

    getLevel(){
        return this.level;
    }

    setLevel(level:GameLevel) {
        this.level = level;
    }
}


