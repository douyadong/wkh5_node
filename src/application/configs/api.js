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
        //"dev": "http://10.0.16.78:8107",
        "dev": "http://m.test.wkzf",
        "test": "http://m.test.wkzf",
        "sim": "http://m.sim.wkzf",
        "prod": "https://m.wkzf.com"
    } ,
    "suffix": { //后缀代表接口去掉prefix的部分，这里可以是无限级的树状结构，根据自己的需要        
        "common" : {
            "dial" : "call/getAgentDial.rest" ,
            "bigData" : "buriedPoint/sendData.rest" ,
            "getCityByLatLon" : "citywap/getCityBusinessModel",
            "cityPinYin": "houseMap/cityInfoByCityPinYin.rest",  //通过城市拼音获取城市信息
            "acWord":"acWord.rest",
            "cityList" : "houseMap/businessCityList.rest"
        } ,
        "space" : {
            "index" : "agent/AgentDetail.rest",
            "secondHouseList":"agent/moreAgentShopSecondeHouseList.rest",
            "rentHouseList":"agent/moreAgentShopRentHouseList.rest",
            "newHouseList":"agent/moreAgentShopNewHouseList.rest"
        } ,
        "rent" : {
            "detail" : "rent/queryHouseDetailForWkzf.rest",
            "list" : {
                "rentHouseList":"rent/rentHouseList.rest",
                "cityAreas": "houseMap/getDicAndTowns.rest",
                "citySubway" : "houseMap/getCitySubwayLines.rest",
                "guessLikeHouse":"rent/guessLikeHouse.rest",
            }
        } ,
        "community" : {
            "detail" : "estate/estateInfo.rest",
            "sameEstateHouseList":"esf/sameEstateHouseList.rest" , // 小区内所有房源
        } ,
        "store" : {
            "store" : "store/getStorePriceInfo.rest" ,
            "agent" : "store/getAgentList.rest" ,
            "house" : "store/getHouseList.rest"
        } ,
        "esf" : {
            "detail" : "sellHouse/getSellHouseDetail.rest" ,
            "list" : "wkzfH5/secondHouseList.rest"
        } ,
        "estate" : {
            "priceChart" : "estate/getEstateHistoricalPriceList.rest" // 小区价格走势图
        } ,
        "trend":{
            "esf":{
                "basePriceTrend":"esf/basePriceTrend.rest", //二手房价格走势
                "estatePriceTrend":"esf/estatePriceTrend.rest", // 小区价格走势
                "townPriceTrend":"esf/townPriceTrend.rest" ,// 板块价格
                "historicalTransactionList":"estate/historicalTransactionList.rest" // 交易历史
            },
            "new":{
                "basePriceTrend":"xf/basePriceTrend.rest", // 新房价格走势
                "loupanPrice":"estate/loupanPrice.rest" ,// 新房楼盘介绍
            }
        },
        "xf": {
            "list": "wkzfH5/newHouseList.rest" ,
            "detail" : "wkzfH5/newHouseDetail.rest" ,
            "dynamic" : "wkzfH5/newHouseDynamicList.rest" ,
            "baseinfo" : "wkzfH5/briefNewHouseDetail.rest"
        },
        "article": {
            "detail": "yfyk/quJingShareArticleDetail.rest",// 用的跟有房有客一样的接口，这是后端定的
            "commentList": "article/queryArticleCommentList.rest",// 文章评论列表查询接口
            "comment": "article/commentArticle.rest", //文章评论接口
            "zan": "article/thumbUp.rest",// 赞接口
        }
    }
} ;
