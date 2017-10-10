/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> system -> middlewares -> global ->  accessLog.js
3. 作者：zhaohuagang@lifang.com
4. 备注：访问日志全局中间件
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

import Logger from "../../libraries/logger" ;

export default function (req, res, next) {
    let logger = new  Logger(req.app) ;
    let logInfo = "request url : " + req.url + " ; " ;    
    switch (req.method) {
        case "POST" :
            logger.info(logInfo + "request params : " + JSON.stringify(req.body)) ;
            break ;
        case "GET" :
            logger.info(logInfo + "request params : " + JSON.stringify(req.query)) ;
            break ;
        default:
            logger.warn("invalid request!") ;
            next(new Error("invalid request!")) ;
            break ;
    } ;
    next() ;
} ;
