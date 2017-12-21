/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> configs -> interface.js
3. 作者：zhaohuagang@lifang.com
4. 备注：由于很多应用只是把数据接口当做model层，而不是直接接触数据库，本文件提供数据接口配置
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default {
    "encoding": "utf-8",
    "json": true,
    "timeout": 60 * 1000,  //超时请求时间，单位：毫秒
    "successCode": 1,  //restfulAPI返回的状态码status多少代表成功
    "sessionExpireCode": 1502,   //restfulAPI返回的状态码status多少代表session失效
    "providerMail": "zhaohuagang@lifang.com;42547335@qq.com",  //当接口不通的时候发邮件给TA
    "prefix": {
        "dev": "http://m.test.wkzf",
        "test": "http://m.test.wkzf",
        "sim": "http://m.sim.wkzf",
        "prod": "http://m.wkzf.com"
    } ,
    "suffix": { //后缀代表接口去掉prefix的部分，这里可以是无限级的树状结构，根据自己的需要        
        "space" : {
            "index" : "agent/AgentDetail.rest"
        } ,
        "rent" : {
            "detail" : "rent/queryHouseDetailForWkzf.rest"
        } ,
        "community" : {
            "detail" : "estate/estateInfo.rest"
        } ,
        "store" : {
            "store" : "store/getStorePriceInfo.rest" ,
            "agent" : "store/getAgentList.rest" ,
            "house" : "store/getHouseList.rest"
        } ,
        "esf" : {
            "detail" : "sellHouse/getSellHouseDetail.rest"
        } ,
        "estate" : {
            "priceChart" : "estate/getEstateHistoricalPriceList.rest"
        }
    }
};