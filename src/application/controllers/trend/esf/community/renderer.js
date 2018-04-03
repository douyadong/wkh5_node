/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> trend -> esf -> community -> renderer.js
3. 作者：liyang@lifang.com
4. 备注：二手房价格行情区域页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../../renderer";
import ApiDataFilter from "../../../../../system/libraries/apiDataFilter";

class Renderer extends AppRendererControllerBasic {
    constructor(req,res,next){
        super(req, res, next);
        this.renders()
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    渲染页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    async renders(){
        let cityPathArray = [ "common" , "cityPinYin"] ;
        let modulePathArray = [ "trend" , "esf" , "community" ] ;
        let apiPathArray = [ "trend" , "esf" , "estatePriceTrend" ] ;
        try{
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            调用接口获取数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let adf = new ApiDataFilter(this.req.app);
            let regionId  = this.req.params.regionId || 17832; //板块Id
            let cityPinYin = this.req.params.city || "shanghai"; // 城市pinyin
            let cityInfo = await adf.request({     // 通过拼音获取城市信息
                "apiPath" : cityPathArray.join(".") ,
                "data" : { "pinyin" : cityPinYin }
            }) ;
            let apiData = await adf.request({
                "apiPath" : apiPathArray.join(".") ,
                "method":"post",
                "contentType":"application/json",
                "data" : { "regionId" : regionId}
            }) ;
            let item = apiData.data;
            this.res.cookie('citySelectionOpen', "" , { httpOnly: false}); // 首次进入租房列表页设置标识（在城市列表页不选择城市但返回的时候用到判断标识）
            this.res.cookie('pinyin', cityPinYin , { httpOnly: false});
            item.cityPY = cityPinYin;
            item.cityName = cityInfo.data.cityName;
            if(item.cityName && item.cityName.charAt(item.cityName.length - 1) === "市") {
                item.cityName = item.cityName.substring( 0 , item.cityName.length - 1) ;
            }
            item.regionId = regionId;
            item.channel = this.req.query['channel'] || "";
            // 额外的脚本样式
            let  extraJavascript = [this.templateData.utilStaticPrefix+'/wkzf/js/util/echarts/echarts.3.2.3.min.js'];
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" : "租房-悟空找房" ,
                "keywords" :  "租房，真实房屋出租" ,
                "description" : "悟空找房网为您提供" ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/") ,
                "extraJavascripts" : extraJavascript ,
                "item": item
            }) ;

            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            渲染模板
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            this.render(modulePathArray.join("/")) ;
        }catch (ex){
            this.next(ex) ;
        }
    }
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer;