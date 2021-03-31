const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const conn = require('../util/sql_base')  //链接数据库

router.use(express.urlencoded()) //解析出 请求体携带过来的参数 放在req.body当中

// 【注册接口 /api/reguser】
router.post('/reguser', (req, res) => {
    // 1.拿到参数
    const { username, password } = req.body
    // console.log(username, password);
    // 2.检测用户username是否被占用
    conn.query(`SELECT * FROM users WHERE username="${username}"`, (err, result) => {
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
        if (result.length > 0) return res.status(201).json({ status: 1, message: '注册失败,用户名已被注册' })
        // 3.注册
        conn.query(`insert into users (username,password) values ("${username}","${password}")`, (err, result) => {
            if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
            res.status(200).json({ status: 0, message: "注册成功！" })
        })
    })
})

// 【登录接口 /api/login】
router.post('/login', (req, res) => {
    const { username, password } = req.body
    conn.query(`SELECT * FROM users WHERE username="${username}" and password="${password}"`, (err, result) => {
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
        if (result.length <= 0) return res.status(201).json({ status: 1, message: '登录失败' })
        // 登录成功 生成token 传递回去
        let token = "Bearer " + jwt.sign({ name: username }, 'bigNewsKey', { expiresIn: 2 * 60 * 60 })
        res.status(200).json({ status: 0, message: "登录成功", token })

    })
})



module.exports = router