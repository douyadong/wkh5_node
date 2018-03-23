/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：wkh5
2. 文件名：src -> application -> controllers -> article -> app-share -> detail -> renderer.js
3. 作者：tangxuyang@lifang.com
4. 备注：取经文章分享页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../../renderer" ;
import ApiDataFilter from "../../../../../system/libraries/apiDataFilter" ;
import UrlParser from "../../../../../system/libraries/urlParser" ;
import guID from "../../../../../system/libraries/guId";
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
创建一个渲染器实例
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
class Renderer extends AppRendererControllerBasic {
    constructor(req, res, next) {
        super(req, res, next) ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        渲染模板
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/       
        this.renders() ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    渲染页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    async renders() {
        let modulePathArray = [ "article" , "app-share" ] ;
        try {
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            载入ApiDataFilter工具
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            // let adf = new ApiDataFilter(this.req.app) ;                       

            // let param ={
            //     cityId: 43/*cityId*/,
            //     pageSize: 10
            // };

            // let data = null;
            
            // // 如果有查询条件，按照查询条件加载数据，否则不加载数据
            // if(this.req.params.condition){                
            //     let conditionObj = urlParser.parseCondition({condition: this.req.params.condition});             
            //     param = this.generateParams(conditionObj, param);                
                
            // }else{
            //     // do nothing
            // }   
            
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据            
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" : "二手房列表" ,
                "keywords" : "" ,
                "description" : "" ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/"),
                "item":{
                "agentModel": {
                    "agentId": 100046,
                    "agentName": "周慧超",
                    "agentMobile": "13764172427",
                    "agentHeadImgUrl": "https://imgwater-test.oss.aliyuncs.com/96cfa88afdc0459287e3cac8ff6c26a5",
                    "headRectImgKey": "96cfa88afdc0459287e3cac8ff6c26a5",
                    "headRoundImgUrl": "https://imgwater-test.oss.aliyuncs.com/96cfa88afdc0459287e3cac8ff6c26a5",
                    "headRoundImgKey": "96cfa88afdc0459287e3cac8ff6c26a5",
                    "agentBelongToCompanyName": "hhhhhhhhh",
                    "agentCommentScore": 0,
                    "agentCommentScoreStr": null,
                    "shi": 0,
                    "kong": 0,
                    "hasSmall": false,
                    "agentWChatId": "18627087329",
                    "agentWChartQRImgUrl": "https://imgwater-test.oss.aliyuncs.com/56568f837ee5446fb7a09323a0f37b7a",
                    "weChatQRImgKey": "56568f837ee5446fb7a09323a0f37b7a",
                    "isWellAgent": 0,
                    "agentVerifiedStatus": 1,
                    "agentBizTown": null,
                    "agentBizTownList": null,
                    "wellAgentBizMessageList": [],
                    "vipType": 4,
                    "abbreviation": "hhhhhhhhh",
                    "companyName": "",
                    "agentVolume": 0,
                    "agentIntroduction": "五年从业经验，促成超过100笔交易，安家置业请选择我。",
                    "agentStory": "成交故事复合弓口干口苦减肥咖啡发没发门面房就放假方方面面犯法吗",
                    "myBizStoryImgUrls": null
                },
                "articleDetailModel": {
                    "title": "我是文章标题",
                    "subTitle": "我是文章简介",
                    "coverUrl": "https://imgwater-test.oss.aliyuncs.com/1b7945f95d2d436697230aa1d958d391",
                    "content": "213123213213123123",
                    "viewNum": 177,
                    "shareTitle": "我是文章标题",
                    "shareContent": "我是文章简介",
                    "shareImageUrl": "https://imgwater-test.oss.aliyuncs.com/1b7945f95d2d436697230aa1d958d391",
                    "shareLinkUrl": "http://h5-dev.yfyk365.com/article/app-share.83.html?cityId=43",
                    "articleSource": "12312",
                    "showTime": 1495609844000,
                    "publishTime": "2017-05-24",
                    "viewNumStr": "177",
                    "commentList": [
                        {
                            "id": 122,
                            "articleId": 83,
                            "guestId": null,
                            "commentContent": "pinglu",
                            "guestPhoto": "https://imgwater-test.oss.aliyuncs.com/584facb239394acea1beefb20ce4db45",
                            "guestNickname": "悟空用户81420",
                            "createTime": "2017-07-05 11:30:12.0",
                            "createDate": 1499225412000,
                            "visitorName": "悟空用户81420",
                            "visitorUrl": "https://imgwater-test.oss.aliyuncs.com/584facb239394acea1beefb20ce4db45",
                            "commentNumStr": "0"
                        },
                        {
                            "id": 72,
                            "articleId": 83,
                            "guestId": null,
                            "commentContent": "习近平",
                            "guestPhoto": "https://imgwater-test.oss.aliyuncs.com/5441850632414386a5b394ebe6210469",
                            "guestNickname": "悟空用户19087",
                            "createTime": "2017-05-31 11:16:43.0",
                            "createDate": 1496200603000,
                            "visitorName": "悟空用户19087",
                            "visitorUrl": "https://imgwater-test.oss.aliyuncs.com/5441850632414386a5b394ebe6210469",
                            "commentNumStr": "0"
                        },
                        {
                            "id": 71,
                            "articleId": 83,
                            "guestId": null,
                            "commentContent": "阿斯蒂芬阿斯蒂芬",
                            "guestPhoto": "https://imgwater-test.oss.aliyuncs.com/24e13a6aa8194dca80720cfe8b2921cf",
                            "guestNickname": "悟空用户83600",
                            "createTime": "2017-05-31 11:13:32.0",
                            "createDate": 1496200412000,
                            "visitorName": "悟空用户83600",
                            "visitorUrl": "https://imgwater-test.oss.aliyuncs.com/24e13a6aa8194dca80720cfe8b2921cf",
                            "commentNumStr": "0"
                        },
                        {
                            "id": 70,
                            "articleId": 83,
                            "guestId": null,
                            "commentContent": "的萨芬阿斯蒂芬阿斯蒂芬",
                            "guestPhoto": "https://imgwater-test.oss.aliyuncs.com/5ecefe4ecb52406086db2ea1a8070334",
                            "guestNickname": "悟空用户78668",
                            "createTime": "2017-05-26 10:40:41.0",
                            "createDate": 1495766441000,
                            "visitorName": "悟空用户78668",
                            "visitorUrl": "https://imgwater-test.oss.aliyuncs.com/5ecefe4ecb52406086db2ea1a8070334",
                            "commentNumStr": "0"
                        },
                        {
                            "id": 69,
                            "articleId": 83,
                            "guestId": null,
                            "commentContent": "阿斯蒂芬阿斯蒂芬",
                            "guestPhoto": "https://imgwater-test.oss.aliyuncs.com/2023702b49604917b5cca7ee137aaf80",
                            "guestNickname": "悟空用户25905",
                            "createTime": "2017-05-26 10:40:27.0",
                            "createDate": 1495766427000,
                            "visitorName": "悟空用户25905",
                            "visitorUrl": "https://imgwater-test.oss.aliyuncs.com/2023702b49604917b5cca7ee137aaf80",
                            "commentNumStr": "0"
                        }
                    ],
                    "commentNumStr": "5",
                    "commentNum": 5,
                    "thumbUpNumStr": "100"
                }
            }
            }) ;
            
            
            Object.assign(this.templateData, {                 
                "matchStylesheetPath" : modulePathArray.join("/"),
                "controllerJavascriptPath" : modulePathArray.join("/"),            
            }) ;                 
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            渲染模板
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/        
            this.render(modulePathArray.join("/")) ; 
        }
        catch(ex){
            this.next(ex) ;
        }
    }
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;