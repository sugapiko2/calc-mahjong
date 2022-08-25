const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const { default: axios } = require("axios");
const fs = require("fs");
const zlib = require("zlib");
app = express();
app.use(serveStatic(path.join(__dirname, "dist")));
const port = process.env.PORT || 80;
app.listen(port, () => console.log("ok"));

app.get("/api/hello", async (req, res) => {
  console.log(req.param);
  await getList(req.query.room);
  res.send("hello");
});

const getList = async (targetRoom) => {
  const listUrl = "https://tenhou.net/sc/raw/list.cgi";
  const response = await axios(listUrl);
  // const tes = (obj.data.split('\r\n'));
  const resNames = response.data
    .split("\r\n")
    .map((d) => d.match(/sca(.*).gz/g))
    .filter((d) => d !== null)
    .map((d) => d[0])
    .reverse();
  console.log(resNames[0]);
  const dataUrl = `https://tenhou.net/sc/raw/dat/${resNames[0]}`;
  const resGZip = await axios(dataUrl, { responseType: "arraybuffer" });
  // 部屋番号を引数として、ユーザーのリストを作成してユーザーごとの点数をプロットしていく？
  // ユーザーの上限をなしとすればよいのか
  // 画面からユーザーを絞るのは別機能とする
  // キーは部屋番号+時間
  // const res = {
  //   key: {
  //     user1: 100,
  //     user2: 100,
  //     user3: 100,
  //     user4: 100,
  //   },
  // };
  const buff = zlib.unzipSync(resGZip.data);
  const resultMap = buff
    .toString("utf-8")
    .split("\n")
    .map((res) => {
      const [room, time, rule, results] = res.split(" | ");
      return {
        room,
        time,
        rule,
        results,
      };
    })
    .filter((res) => !targetRoom || res.room === targetRoom);
  console.log(targetRoom);
  resultMap.forEach((re) => console.log(re.room));
  resultMap.forEach((re) => console.log(re.results));
  // results.console.log(resultMap[0]);
  // console.log(resultMap[10]);
  // zlib.gunzip(resGZip.data, (err, binary) => {
  //   // TODO エラーハンドリング
  //   const result = binary.toString("utf-8");
  //   // DBに結果を入れる？
  //   const [room, time, rule, results] = result.split(" | ");
  //   console.log("tetete");
  //   console.log(room);
  //   // if (targetRoom !== room) {
  //   //   return;
  //   // }
  //   console.log(result);
  // });
  // console.log(dataUrl);

  // ユーザー名に半角スペースは禁止されているから、半角スペースで区切ればOK
  // L8141 | 15:37 | 三般南喰赤－ | ぼぽばぱ(+42.4) ｒのり(-9.6) NoName(-32.8)
  // L3724
};
