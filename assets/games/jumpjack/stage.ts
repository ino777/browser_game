import { ObstacleParams, WindParams } from "./models";

const bounciness = 0.7

// W:960 , H:720
// Half: W: 480, H:360
// ジャンプ最大: H:270ぐらい
export const stageObstacles: ObstacleParams[] = [
    // 最下部地面
    { point: { x: 480, y: 0 }, w: 1000, h: 100, options: { tag: "ground", bounciness: bounciness } },


    // 左壁
    { point: { x: 0, y: 360 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },
    // 右壁
    { point: { x: 960, y: 360 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },

    // 足場
    { point: { x: 480, y: 130 }, w: 120, h: 260, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 180, y: 370 }, w: 80, h: 80, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 430, y: 470 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 550, y: 470 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 780, y: 600 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 490, y: 645 }, w: 160, h: 150, options: { tag: "ground", bounciness: bounciness } },

    // 左壁
    { point: { x: 0, y: 1080 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },
    // 右壁
    { point: { x: 960, y: 1080 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },

    // 足場
    { point: { x: 490, y: 770 }, w: 160, h: 105, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 920, y: 790 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 750, y: 1000 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 550, y: 960 }, w: 40, h: 300, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 550, y: 1230 }, w: 40, h: 120, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 490, y: 840 }, w: 160, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 430, y: 1120 }, w: 40, h: 360, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 490, y: 1290 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 100, y: 840 }, w: 280, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 220, y: 1130 }, w: 40, h: 380, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 160, y: 960 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 160, y: 1130 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 180, y: 1320 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },

    // 左壁
    { point: { x: 0, y: 1800 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },
    // 右壁
    { point: { x: 960, y: 1800 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },

    // 足場
    { point: { x: 150, y: 1520 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 450, y: 1520 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 600, y: 1520 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 750, y: 1520 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 950, y: 1600 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 750, y: 1800 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 600, y: 1800 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 450, y: 1800 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 150, y: 1900 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 450, y: 2050 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 600, y: 2050 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 750, y: 2050 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },

    // 左壁
    { point: { x: 0, y: 2520 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },
    // 右壁
    { point: { x: 960, y: 2520 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },

    // 足場
    { point: { x: 950, y: 2200 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 700, y: 2350 }, w: 40, h: 80, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 880, y: 2560 }, w: 160, h: 200, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 700, y: 2600 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 140, y: 2350 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 140, y: 2550 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 140, y: 2750 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },

    // 左壁
    { point: { x: 0, y: 3240 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },
    // 右壁
    { point: { x: 960, y: 3240 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },

    // 足場
    { point: { x: 100, y: 3000 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 100, y: 3040 }, w: 20, h: 80, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 720, y: 2900 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 720, y: 2940 }, w: 20, h: 80, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 200, y: 3200 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 200, y: 3240 }, w: 20, h: 80, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 460, y: 2950 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 460, y: 2990 }, w: 20, h: 80, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 800, y: 3150 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 800, y: 3190 }, w: 20, h: 80, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 600, y: 3350 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 600, y: 3390 }, w: 20, h: 80, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 330, y: 3450 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 330, y: 3490 }, w: 20, h: 80, options: { tag: "ground", bounciness: bounciness } },

    // 左壁
    { point: { x: 0, y: 3960 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },
    // 右壁
    { point: { x: 960, y: 3960 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },

    //足場
    { point: { x: 70, y: 3700 }, w: 140, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 360, y: 3800 }, w: 120, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 760, y: 3800 }, w: 400, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 600, y: 3980 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 920, y: 4050 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 370, y: 4130 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 670, y: 4200 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 120, y: 4230 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },

    // 左壁
    { point: { x: 0, y: 4680 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },
    // 右壁
    { point: { x: 960, y: 4680 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },

    // 足場
    { point: { x: 300, y: 4400 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 700, y: 4400 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 920, y: 4500 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 700, y: 4600 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 460, y: 4680 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 210, y: 4680 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 40, y: 4800 }, w: 80, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 300, y: 4940 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },

    // 左壁
    { point: { x: 0, y: 5400 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },
    // 右壁
    { point: { x: 960, y: 5400 }, w: 50, h: 740, options: { tag: "wall", bounciness: bounciness } },

    //足場
    { point: { x: 580, y: 5140 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 320, y: 5280 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 500, y: 5420 }, w: 40, h: 40, options: { tag: "ground", bounciness: bounciness } },
    { point: { x: 860, y: 5500 }, w: 200, h: 40, options: { tag: "goal", bounciness: bounciness } },
]

export const statgeWind: WindParams[] = [
    { point: { x: 460, y: 3980 }, w: 1000, h: 700, strength: 0.1 },
    { point: { x: 460, y: 4670 }, w: 1000, h: 720, strength: 0.1 }
]