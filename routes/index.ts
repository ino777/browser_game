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

export default router;