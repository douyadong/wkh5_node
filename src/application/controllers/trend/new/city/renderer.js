/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> trend -> new -> city -> renderer.js
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
        let modulePathArray = [ "trend" , "new" , "city" ] ;
        let apiPathArray = [ "trend" , "new" , "basePriceTrend" ] ;
        try{
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            调用接口获取数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let adf = new ApiDataFilter(this.req.app);
            let cityPinYin = this.req.params.city || "shanghai"; // 城市pinyin
            let defultName = this.req.cookies.selectedCityName;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            切换业务模块的情况下，由其他模块跳入租房业务，首先判断有客户选择城市有没有租房业务，没有就查看默认路由拼音是否支持租房业务，不支持跳到上海
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let BusinessSpurt = true;
            let cityInfo = {};
            if(this.req.cookies && this.req.cookies.selectedCityPinyin) {  // 判断是否有客户选择的城市
                cityInfo = await adf.request({
                    "apiPath" : cityPathArray.join("."),
                    "data" : { "pinyin": this.req.cookies.selectedCityPinyin} ,
                }) ;
                if( cityInfo.data.newBusiness ){
                    let cityId =  cityInfo.data.cityId
                } else {     // 客户选择的城市不支持租房业务
                    BusinessSpurt = cityInfo.data.newBusiness
                }
            }else {   // 没有用户选择的城市
                cityInfo = await adf.request({
                    "apiPath" : cityPathArray.join("."),
                    "data" : cityPinYin ,
                }) ;
                if (cityInfo.data.newBusiness ){
                    let  cityId =  cityInfo.data.cityId;
                }else {
                    BusinessSpurt = cityInfo.data.newBusiness
                }
            }
            /*     let cityInfo = await adf.request({     // 通过拼音获取城市信息
                     "apiPath" : cityPathArray.join(".") ,
                     "data" : { "pinyin" : cityPinYin }
                 }) ;*/
            let apiData = await adf.request({   // 请求城市价格走势
                "apiPath" : apiPathArray.join(".") ,
                "method":"post",
                "contentType":"application/json",
                "data" : { "regionId" : cityInfo.data.cityId ,"regionType":1}
            }) ;
            let item = apiData.data;
            this.res.cookie('citySelectionOpen', "" , { httpOnly: false}); // 首次进入租房列表页设置标识（在城市列表页不选择城市但返回的时候用到判断标识）
            this.res.cookie('pinyin', cityPinYin , { httpOnly: false});
            item.cityPY = cityPinYin;
            item.cityName = cityInfo.data.cityName;
            if(item.cityName && item.cityName.charAt(item.cityName.length - 1) === "市") {
                item.cityName = item.cityName.substring( 0 , item.cityName.length - 1) ;
            }
            item.regionId = cityInfo.data.cityId;
            item.channel = this.req.query['channel'] || "";
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            大数据埋点参数
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            item['DataParams'] ={
                //页头在售房源入口
                topOnSell : this.generateBigDataParams({
                    eventName: '1113001',
                    eventParam:{city_id:item.regionId },
                    type: 2
                }),
                //区域部分-查看所有房源入口
                district : this.generateBigDataParams({
                    eventName: '1113002',
                    eventParam:{city_id:item.regionId },
                    type: 2
                }),
            };
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
                "item": item,
                "BusinessSpurt":BusinessSpurt
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