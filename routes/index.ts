import express from "express";

const router = express.Router();

type Context = {
    key: string,
    title: string,
    args?: object,
};

router.get("/", (req, res, next) => {
    const context: Context = {
        key: "home",
        title: "home",
    }
    res.render("index", context)
});

router.get("/aimalien", (req, res, next) => {
    const context: Context = {
        key: "aimalien",
        title: "Aim Alien",
        args: {
            gameSrc: "./aimalien.js"
        }
    }
    res.render("aimalien", context)
})

router.get("/jumpjack", (req, res, next) => {
    const context: Context = {
        key: "jumpjack",
        title: "Jump Jack",
        args: {
            gameSrc: "./jumpjack.js"
        }
    }
    res.render("jumpjack", context);
})

export default router;