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
            "apiPath" : "space.index" ,
            "data" : { "agentId" : agentId }
        }) ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        对推荐房源数据进行大数据埋点以及跳转地址的处理
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        if(apiData.data.oldHouseList) {
            for(let n = 0 ; n < apiData.data.oldHouseList.length ; n ++) {
                apiData.data.oldHouseList[n].bigDataParams = this.generateBigDataParams( { "eventName" : 1002017 , "eventParam" : { } } ) ;
                apiData.data.oldHouseList[n].url = this.templateData.domain + "/" + this.req.params.city + "/esf/" + apiData.data.oldHouseList[n].encryptHouseId + ".html" ;
            }
        }
        if(apiData.data.newHouseList) {
            for(let n = 0 ; n < apiData.data.newHouseList.length ; n ++) {
                apiData.data.newHouseList[n].bigDataParams = this.generateBigDataParams( { "eventName" : 1002010 , "eventParam" : { "new_house_id" : apiData.data.newHouseList[n].subEstateId } } ) ;
                apiData.data.newHouseList[n].url = this.templateData.domain + "/" + this.req.params.city + "/xfdetail/" + apiData.data.newHouseList[n].encryptSubEstateId + ".html" ;
            }
        }
        if(apiData.data.rentHouseList) {
            for(let n = 0 ; n < apiData.data.rentHouseList.length ; n ++) {                
                apiData.data.rentHouseList[n].url = this.templateData.currentProjectDir + this.req.params.city + "/rent/share-detail/" + apiData.data.rentHouseList[n].encryptHouseId ;
            }
        }
        
        Object.assign(this.templateData , apiData.data ) ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        判断是否需要显示tabs
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        let tabsCount = 0 ;
        if(this.templateData.oldHouseList && this.templateData.oldHouseList.length > 0 )  tabsCount ++ ;
        if(this.templateData.newHouseList && this.templateData.newHouseList.length > 0 )  tabsCount ++ ;
        if(this.templateData.rentHouseList && this.templateData.rentHouseList.length > 0 )  tabsCount ++ ;
        Object.assign(this.templateData , { "tabsCount" : tabsCount } ) ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        给下面辅助条加上埋点数据
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        Object.assign(this.templateData.agent , {
            "mobileBigDataParams" : this.generateBigDataParams( { "eventName" : 1002001 , "eventParam" : { "agent_id" : agentId } } ) ,
            "avatarBigDataParams" :  this.generateBigDataParams( { "eventName" : 1002001 , "eventParam" : { "agent_id" : agentId } } ) ,
            "wxBigDataParams" : this.generateBigDataParams( { "eventName" : 1002007 , "eventParam" : { "agent_id" : agentId } } )
        } ) ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        扩展模板常规数据
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        Object.assign(this.templateData, { 
            "title" : "经纪人个人店铺" , 
            "wechatTitle" : apiData.data.wxShareTitle ,
            "wechatContent" : apiData.data.wxShareDesc ,
            "wechatImgUrl" : apiData.data.wxShareImgUrl
        }) ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        扩展模板大数据埋点数据
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        Object.assign(this.templateData, { 
            "bigDataParams" : {
                "esfTab" : this.generateBigDataParams( { "eventName" : 1002008 , "eventParam" : {} } ) ,
                "xfTab" : this.generateBigDataParams( { "eventName" : 1002009 , "eventParam" : {} } ) ,
                "rentTab" : this.generateBigDataParams( { "eventName" : 1002029 , "eventParam" : {} } )    
            }
        }) ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        渲染模板
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/        
        this.render("space/index") ; 
    }
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;