const express = require('express')
const cors = require('cors')
const jwt = require('express-jwt')
const accountRouter = require('./router/account_router')   //登录注册
const userRouter = require('./router/user_router')         //用户信息
const cateRouter = require('./router/cate_router')         //文章信息


const app = express()

app.use(cors())                                  //cors跨域设置
app.use('/uploads', express.static('./uploads')) //静态资源托管
app.use(jwt({
    secret: 'bigNewsKey', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/reguser', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}))                                 //访问权限设置  jwt解析token

// 路由管理
app.use('/api', accountRouter)
app.use('/my', userRouter)
app.use('/my/article', cateRouter)

// 错误处理
app.use((req, res, next) => {
    if (err.name === 'UnauthorizedError') { res.status(401).send({ code: 1, message: '身份认证失败！' }); }
})




// 开启监听 服务器开启
app.listen(3000, () => { console.log('big_news_server start 3000!!!!!'); }) //服务器开启 端口3000