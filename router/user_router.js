const express = require('express')
const conn = require('../util/sql_base')  //链接数据库
const multer = require('multer')          //第三方模块 解析请求体中的文件

const router = express.Router()

router.use(express.urlencoded()) //将请求体中携带的普通键值对参数 解析 保存到req.body中
const storage = multer.diskStorage({// 精细化去设置，如何去保存文件
    destination: function (req, file, cb) { cb(null, 'uploads'); }, // 保存在哪里
    filename: function (req, file, cb) {  // 保存时，文件名叫什么
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName) //
    }
})
const upload = multer({ storage })



// 【获取用户的基本信息   /my/userinfo 】
router.get('/userinfo', (req, res) => {
    const { username } = req.query
    conn.query(`SELECT id,username,nickname,email,userPic FROM users WHERE username="${username}"`, (err, result) => {
        console.log(err);
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
        if (result.length <= 0) return res.status(201).json({ status: 1, message: '获取用户基本信息失败' })
        res.status(200).json({ status: 0, message: "获取用户基本信息成功！", data: result[0] })
    })
})

// 【更新用户的基本信息  /my/userinfo 】
router.post('/userinfo', (req, res) => {
    const { nickname, id, email, userPic } = req.body
    let queryStr = []
    if (nickname) queryStr.push(`nickname="${nickname}"`)
    if (email) queryStr.push(`email="${email}"`)
    if (userPic) queryStr.push(`userPic="${userPic}"`)
    conn.query(`UPDATE users set ${queryStr.join()} WHERE id=${id}`, (err, result) => {
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
        console.log(result);
        if (result.affectedRows <= 0) return res.status(201).json({ status: 1, message: '修改用户信息失败' })
        res.status(200).json({ status: 0, message: "修改用户信息成功！" })
    })
})

// 重置密码  /my/updatepwd 】
router.post('/updatepwd', (req, res) => {
    let { oldPwd, newPwd, id } = req.body
    // 判断用户 旧密码 是否正确
    conn.query(`SELECT password FROM users WHERE id="${id}"`, (err, result) => {
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
        console.log(result);
        if (result[0].password != oldPwd) return res.status(201).json({ status: 1, msg: "更新密码失败,原密码错误" })
        conn.query(`UPDATE users set password=${newPwd} WHERE id=${id}`, (err, result) => {
            if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
            res.status(200).json({ "status": 0, "message": "更新密码成功！" })
        })
    })
})

// 【上传用户头像  /my/uploadPic 】
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    // console.log(req.file); //文件保存在req对象的file中
    res.status(200).json({ "status": 0, "message": `http://127.0.0.1:3000/uploads/${req.file.filename}` })
})




module.exports = router