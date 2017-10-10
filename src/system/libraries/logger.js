/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> system -> libraries ->  logger.js
3. 作者：zhaohuagang@lifang.com
4. 备注：日志记录工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import path from "path" ;
import fs from "fs" ;
import log4js from "log4js" ;

let loggerInfo = log4js.getLogger("info") ;
let loggerError = log4js.getLogger("error") ;
let loggerWarn = log4js.getLogger("warn") ;
let instance = null

class Logger {
    constructor(app) {
        if ( ! instance) {
            instance = this ;
            this.logConf = app.locals.confs.log ;
            log4js.configure(this.logConf) ;
        }
        return instance
    }  

    info(info) {
        if (info) loggerInfo.info(info) ;
    }

    error(error) {
        if (error) loggerError.error(error) ;
    }

    warn(warn) {
        if (warn) loggerWarn.warn(warn) ;
    }
}

export default Logger ;

