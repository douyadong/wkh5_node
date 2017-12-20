/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> esf -> detail -> renderer.js
3. 作者：zhaohuagang@lifang.com
4. 备注：二手房详情页面渲染器
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
        let modulePathArray = [ "esf" , "detail" ] ;
        try {
            let adf = new ApiDataFilter(this.req.app) ;   
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            获取houseId
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/ 
            let houseId = this.req.params.houseId || "" ;
            // 获取city
             let city = this.req.params.city || "" ;
             let apiData = require("../../../mock/esf/esf")["default"].data ;
             let item = apiData;
            // 地图跳转路径
            item['mapUrl'] = this.templateData.domain + '/esf/map.html?longitude=' + item.estate.longitude + '&latitude=' + item.estate.latitude + '&houseName=' + item.estate.subEstateName + '&houseAddress=' + item.estate.estateAddr;
            // 计算器URL
            item.house['calculatorUrl'] = this.templateData.domain +'/houseLoanCalculator.html?totalPrice='+item.house.totalPrice;
            // 经纪人路径跳转URL
            item.agent['url'] = '/';
            // 小区详情URL
            item.estate['estateUrl'] = this.templateData.domain +'/'+city+'/community/'+item.estate.subEstateId+'.html';
            // 额外的脚本样式
            let  extraJavascript = ['//dev01.fe.wkzf/fe_public_library/wkzf/js/util/echarts/echarts.js'];
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
         /*   let apiData = await adf.request({
                "apiPath" : modulePathArray.join(".") ,
                "data" : { "houseId" : houseId }
            }) ; */



            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" :"二手房详情" ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/"),
                "extraJavascripts" : extraJavascript ,
                "item" : item ,
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