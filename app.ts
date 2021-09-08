import express from "express";
import path from "path";
import index from "./routes/index";

const app = express();
const port = 8080;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


app.use("/", express.static(path.join(__dirname, "dist")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/", index);

app.listen(port);