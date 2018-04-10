/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> store -> index -> renderer.js
3. 作者：douyadong@lifang.com
4. 备注：店铺首页渲染器
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
        上拉加载每次多少条
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        this.pageSize = 20 ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        渲染模板
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/       
        this.renders() ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    渲染页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    async renders() {
        let modulePathArray = [ "store" , "index" ] ;        
        try {
            let storeId = this.req.params.storeId || "10027" ;
            let adf = new ApiDataFilter(this.req.app) ; 
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            调用门店房源均价接口获取数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/             
            let storeApiData = await adf.request({
                "apiPath" : "store.store" ,
                "data" : { "storeId" : storeId }
            }) ;
            let cityPinYin = storeApiData.data.priceModel.pinyin ? storeApiData.data.priceModel.pinyin : this.req.params.city;
            if(cityPinYin && cityPinYin.substr(cityPinYin.length-3) =="shi"){
                cityPinYin = cityPinYin.substring(0,cityPinYin.length-3);
                storeApiData.data.priceModel.pinyin = cityPinYin;
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            调用门店经纪人接口获取数据，这里是一次性加载，所以把pageSize设置得比较高
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/             
            let agentApiData = await adf.request({
                "apiPath" : "store.agent" ,
                "data" : { "storeId" : storeId , "pageIndex" : 0 , pageSize : 1000 }
            }) ;
            if(agentApiData.data) {
                for(let n = 0 ; n < agentApiData.data.length ; n ++) {
                    agentApiData.data[n].bigDataParams = this.generateBigDataParams( { "eventName" : 1222004 , "eventParam" : { "store_id" : storeId , "agent_id" : agentApiData.data[n].agentId } } ) ;
                    agentApiData.data[n].phoneBigDataParams = this.generateBigDataParams( { "eventName" : 1222006 , "eventParam" : { "store_id" : storeId , "agent_id" : agentApiData.data[n].agentId } } ) ;
                    agentApiData.data[n].wxBigDataParams = this.generateBigDataParams( { "eventName" : 1222005 , "eventParam" : { "store_id" : storeId , "agent_id" : agentApiData.data[n].agentId } } ) ;
                    agentApiData.data[n].url = "/" + cityPinYin + "/space/" + agentApiData.data[n].agentId + ".html" ;
                }
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            调用门店房源接口获取数据并做相应处理
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let houseApiData = await adf.request({
                "apiPath" : "store.house" ,
                "data" : { "storeId" : storeId , "pageIndex" : 0 , pageSize : this.pageSize }
            }) ;
            if(houseApiData.data) {
                for(let n = 0 ; n < houseApiData.data.length ; n ++) {
                    houseApiData.data[n].bigDataParams = this.generateBigDataParams( { "eventName" : 1222001 , "eventParam" : { "store_id" : storeId , "house_id" : houseApiData.data[n].houseId } } ) ;
                    houseApiData.data[n].url = "/" + cityPinYin + "/esf/" + houseApiData.data[n].encryptHouseId + ".html"+"?storeId="+storeId ;
                }
            }    
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据            
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/            
            Object.assign(this.templateData, { 
                "title" : storeApiData.data.priceModel.name ? storeApiData.data.priceModel.name +"-悟空找房" : "悟空找房" , 
                "keywords" : "" ,
                "description" : "" ,
                "wechatTitle" : storeApiData.data.title ,
                "wechatContent" : storeApiData.data.content ,
                "wechatImgUrl" : storeApiData.data.picUrl , 
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/") ,
                "storeId" : storeId,
                "cityPinYin":cityPinYin
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData , { store : storeApiData.data.priceModel } ) ;
            Object.assign(this.templateData , { oldHouseList : houseApiData.data } ) ;
            Object.assign(this.templateData , { agentList : agentApiData.data } ) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板大数据埋点数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, { 
                "bigDataParams" : {
                    "esfTab" : this.generateBigDataParams( { "eventName" : 1222002 , "eventParam" : { "store_id" : storeId } } ) ,
                    "agentTab" : this.generateBigDataParams( { "eventName" : 1222003 , "eventParam" : { "store_id" : storeId } } ),
                    "noHouse" : this.generateBigDataParams( { "eventName" : 1220011 , "eventParam" : { "store_id" : storeId } } ),
                    "noAgent" : this.generateBigDataParams( { "eventName" : 1220012 , "eventParam" : { "store_id" : storeId } } ),
                }
            }) ;        
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            渲染模板
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/        
            this.render(modulePathArray.join("/")) ; 
        }
        catch(ex) {
            this.next(ex) ;
        }
    }
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;