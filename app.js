const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.connect("mongodb://localhost/shopping-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();





router.post("/users", async ( req, res ) => {
    const { nickname, email, password, confirmPassword } = req.body;

    // 패스워드 재입력 확인 절차
    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage : "패스워드가 확인란과 동일하지 않습니다.",
        });
        return; // return을 해야 여기서 런다임을 끊을 수 있다.
    }

    // 기존 유저 로그인 여부 확인
    // find에 쿼리 결합(or, 이메일 또는 닉네임 조건을 충족하는가)
    const existUsers = await User.find({
        $or: [{ email }, {nickname}], 
    });

    if (existUsers.length) {
        res.status(404).send({
            errorMessage : "이미 가입된 이메일 또는 닉네임이 있습니다.",
        });
    }
    
    // 기존 유저가 없다면 유저에 신규 항목을 추가
    const user = new User({ email, nickname, password });
    await user.save();

    res.status(201).send({ })
});


app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.listen(8080, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
});