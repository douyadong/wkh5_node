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
        "dev": "http://10.0.18.118:8088",
        "test": "http://10.0.18.118:8088",
        "sim": "http://10.0.18.118:8088",
        "prod": "http://172.16.13.2:8088"
    },
    "suffix": { //后缀代表接口去掉prefix的部分，这里可以是无限级的树状结构，根据自己的需要
        "common": {
            "pages": "page/getPageNameList.action",  //根据平台信息获取页面信息   埋点
            "events": "click/selectClickNameList.action",   //获取事件  埋点
            "params": "param/getParamNameList.action", //获取参数   埋点
            "apps": "reportPandect/getType.action",   //获取端口数据   数据决策
            "pagesCustom": "reportPandect/getPageList.action",//根据数据端口获取页面信息   数据决策
            "eventsCustom": "reportPandect/getClickList.action"//根据页面id获取是夹信息   数据决策用
        }        
    }
};