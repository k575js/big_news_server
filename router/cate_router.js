const express = require('express')
const conn = require('../util/sql_base')  //链接数据库
const router = express.Router()

router.use(express.urlencoded()) //请求体携带的普通键值对参数 解析出来 放在req.body中

// 【 获取文章分类列表  /my/article/cates 】
router.get('/cates', (req, res) => {
    conn.query(`SELECT * FROM categories`, (err, result) => {
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
        console.log(result);
        res.status(200).json({
            "status": 0,
            "message": "获取文章分类列表成功！",
            "data": result
        })
    })
})

// 【 新增文章分类  /my/article/addcates 】
router.post('/addcates', (req, res) => {
    const { name, slug } = req.body
    conn.query(`insert into categories (name,slug)  values ("${name}","${slug}")`, (err, result) => {
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误,内容重复" })
        res.status(200).json({ status: 0, msg: "新增文章分类成功!" })
    })
})

// 【 根据 Id 删除文章分类  /my/article/deletecate 】
router.get('/deletecate', (req, res) => {
    const { id } = req.query
    conn.query(`delete  from categories  where id=${id}`, (err, result) => {
        console.log(err);
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
        if (result.affectedRows <= 0) return res.status(201).json({ status: 1, msg: "删除文章分类失败" })
        res.status(200).json({ status: 0, msg: "删除文章分类成功!" })
    })
})

// 【 根据 Id 获取文章分类数据  /my/article/getCatesById 】
router.get('/getCatesById', (req, res) => {
    const { id } = req.query
    conn.query(`SELECT * FROM categories  where id=${id}`, (err, result) => {
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
        if (result.length <= 0) return res.status(201).json({ status: 1, msg: "获取文章分类数据失败" })
        res.status(200).json({ status: 0, msg: "获取文章分类数据成功!", data: result })
    })
})

// 【 根据 Id 更新文章分类数据  /my/article/updatecate 】
router.post('/updatecate', (req, res) => {
    const { id, name, slug } = req.body
    const queryStr = []
    if (name) queryStr.push(`name="${name}"`)
    if (slug) queryStr.push(`slug="${slug}"`)
    conn.query(`UPDATE categories SET ${queryStr.join()} WHERE id=${id}`, (err, result) => {
        console.log(err);
        if (err) return res.status(500).json({ status: 500, msg: "服务器错误" })
        if (result.affectedRows <= 0) return res.status(201).json({ status: 1, msg: "更新分类信息失败" })
        res.status(200).json({ status: 0, msg: "更新分类信息成功!" })
    })
})


module.exports = router