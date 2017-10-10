/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> system -> middlewares -> api ->  cors.js
3. 作者：zhaohuagang@lifang.com
4. 备注：白名单跨域处理
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default function (req, res, next) {
    let corsConf = req.app.locals.confs.cors ;    
    let env = req.app.locals.stage_env ;
    let whiteList = corsConf[env] ;    
    let origin = req.headers.origin ;
    if (whiteList === "*" || whiteList.indexOf(origin) !== -1) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
        res.header('Access-Control-Allow-Credentials', true) ;
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE') ;
    }
    next() ;
} ;
