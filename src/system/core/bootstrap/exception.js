/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> system -> core -> bootstrap ->exception.js
3. 作者：zhaohuagang@lifang.com
4. 备注：系统启动项 -> 错误处理
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
模块输出为一个方法，在app.js中执行，把以express创建的应用app当做参数
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default function(app){   
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    抓取404错误并转向错误处理器
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    app.use(function(req, res, next) {
        let err = new Error('Not Found') ;
        err.status = 404 ;
        next(err) ;
    }) ;
     /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    将所有错误渲染到处理页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    app.use(function(err, req, res, next) {
        res.status(err.status || 500) ;
        res.redirect("/seo/error.html") ;       
    }) ;
} ;