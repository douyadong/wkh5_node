/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> system -> libraries -> config.js
3. 作者：zhaohuagang@lifang.com
4. 备注：对session的处理
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

class Redis {
    constructor() {
        
    }    
    static getRedisConf(app) {
        let redisArray = app.locals.confs.redis[app.locals.stage_env] ;
        let redisConfArray = [] ;
        if (redisArray && redisArray.length) {
            for (let v of redisArray) {
                redisConfArray.push({
                    host : v.host ,
                    port : v.port
                }) ;
            }
        }
        return redisConfArray ;
    }
}

export default Redis ;

