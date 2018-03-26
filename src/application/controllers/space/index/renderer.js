/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> space -> index -> shareRenderer.js
3. 作者：zhaohuagang@lifang.com
4. 备注：经纪人个人店铺首页分享页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../renderer" ;
import ApiDataFilter from "../../../../system/libraries/apiDataFilter" ;
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
        let modulePathArray = [ "space" , "index" ] ; // 经纪人详情
        let newPathArray = [ "space" , "newHouseList" ] ; // 新房列表
        let secondPathArray = [ "space" , "secondHouseList" ] ; // 二手房列表
        let rentPathArray = [ "space" , "rentHouseList" ] ; // 租房列表
        try {
            let adf = new ApiDataFilter(this.req.app) ;   
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            获取经纪人id
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/ 
            let agentId = this.req.params.agentId || "" ;         
            // let apiData = require("../../../mock/space/index.js")["default"] ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let apiData = await adf.request({
                "apiPath" : modulePathArray.join(".") ,
                "data" : { "agentId" : agentId }
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板新房api数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let newApiData = await adf.request({
                "apiPath" : newPathArray.join(".") ,
                "data" : { "agentId" : agentId ,"pageIndex":0,"pageSize":10}
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板二手房api数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let secondApiData = await adf.request({
                "apiPath" : secondPathArray.join(".") ,
                "data" : { "agentId" : agentId ,"pageIndex":0,"pageSize":10}
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板租房api数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let rentApiData = await adf.request({
                "apiPath" : rentPathArray.join(".") ,
                "data" : { "agentId" : agentId ,"pageIndex":0,"pageSize":10}
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            对推荐房源数据进行大数据埋点以及跳转地址的处理
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            if(secondApiData.data && secondApiData.data.houseList) {
                for(let n = 0 ; n < secondApiData.data.houseList.length ; n ++) {
                    secondApiData.data.houseList[n].bigDataParams = this.generateBigDataParams( { "eventName" : 1002017 , "eventParam" : { } } ) ;
                    secondApiData.data.houseList[n].url = "/" + this.req.params.city + "/esf/" + secondApiData.data.houseList[n].encryptHouseId + ".html?agentId="+agentId ;
                }
            }
            if(newApiData.data && newApiData.data.houseList) {
                for(let n = 0 ; n < newApiData.data.houseList.length ; n ++) {
                    newApiData.data.houseList[n].bigDataParams = this.generateBigDataParams( { "eventName" : 1002010 , "eventParam" : { "new_house_id" : newApiData.data.houseList[n].subEstateId } } ) ;
                    newApiData.data.houseList[n].url = "/" + this.req.params.city + "/xfdetail/" + newApiData.data.houseList[n].encryptSubEstateId + ".html" ;
                }
            }
            if(rentApiData.data && rentApiData.data.rentHouseList) {
                for(let n = 0 ; n < rentApiData.data.rentHouseList.length ; n ++) {
                    rentApiData.data.rentHouseList[n].url = "/" + this.req.params.city + "/rent/" + rentApiData.data.rentHouseList[n].encryptHouseId + ".html?agentId="+agentId;
                }
            }
            let houseList={
                newHouseList:newApiData.data && newApiData.data.houseList ? newApiData.data.houseList : '',
                oldHouseList:secondApiData.data && secondApiData.data.houseList ? secondApiData.data.houseList : '',
                rentHouseList:rentApiData.data && rentApiData.data.rentHouseList ? rentApiData.data.rentHouseList : ''
            };
            Object.assign(this.templateData , apiData.data, houseList) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            判断是否需要显示tabs
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let tabsCount = 0 ;
            if(this.templateData.oldHouseList && this.templateData.oldHouseList.length > 0 )  tabsCount ++ ;
            if(this.templateData.newHouseList && this.templateData.newHouseList.length > 0 )  tabsCount ++ ;
            if(this.templateData.rentHouseList && this.templateData.rentHouseList.length > 0 )  tabsCount ++ ;
            Object.assign(this.templateData , { "tabsCount" : tabsCount } ) ;
             /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            经纪人名称和城市中文名称后面会有多个地方用到，城市名称最后的市字要去掉
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let agentName = apiData.data.agent.agentName ;
            let cityName = apiData.data.agent.cityName ;
            if(cityName && cityName.charAt(cityName.length - 1) === "市") {
                cityName = cityName.substring( 0 , cityName.length - 1) ;
            }               
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据  agentName + "_" + cityName + "优秀房产经纪人推荐-悟空找房" ,
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, { 
                "title" :  agentName + "的名片" ,
                "keywords" : agentName + ",房产经纪人" + agentName + "," + cityName + "优秀房地产经纪人推荐" ,
                "description" : "悟空找房网为您展示房地产经纪人" + agentName + "的房屋交易信息，客户评价等信息，让您真实了解到房产经纪人" + agentName + "的情况，更加放心去选择" + cityName + "靠谱经纪人，找房产经纪人就上悟空找房网。" ,
                "wechatTitle" : apiData.data.wxShareTitle ,
                "wechatContent" : apiData.data.wxShareDesc ,
                "wechatImgUrl" : apiData.data.wxShareImgUrl , 
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/") ,
                "cityName" : cityName , //download-app里面需要这个变量,
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板大数据埋点数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, { 
                "bigDataParams" : {
                    "esfTab" : this.generateBigDataParams( { "eventName" : 1002008 , "eventParam" : {} } ) ,
                    "xfTab" : this.generateBigDataParams( { "eventName" : 1002009 , "eventParam" : {} } ) ,
                    "rentTab" : this.generateBigDataParams( { "eventName" : 1002029 , "eventParam" : {} } ) ,
                    "phone" : this.generateBigDataParams( { "eventName" : 1002001 , "eventParam" : { "agent_id" : agentId } } ) ,
                    "wx" : this.generateBigDataParams( { "eventName" : 1002007 , "eventParam" : { "agent_id" : agentId } } )
                }
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