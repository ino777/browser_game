const path = require("path");

const GAMEDIR = path.join(__dirname, "assets", "games");

const games = {
    // モジュールバンドルを行う起点となるファイルの指定
    entry: {
        aimalien: path.join(GAMEDIR, "aimalien", "app.ts")
    },
    output: {
        // モジュールバンドルを行った結果を出力する場所やファイル名の指定
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    // モジュールとして扱いたいファイルの拡張子
    resolve: {
        extensions: [".ts", ".js"]
    },
    // モジュールに適用するルールの設定
    module: {
        rules: [
            {
                // TypeScript
                test: /\.ts$/, loader: "ts-loader",
            },
            {
                // 画像, 音声, フォント
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: "file-loader",
            },
            {
                // CSS
                test: /\.css$/, use: ["style-loader", "css-loader"]
            }

        ]
    },
}

module.exports = games;