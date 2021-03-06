/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> trend -> esf -> town-list -> renderer.js
3. 作者：liyang@lifang.com
4. 备注：二手房价格行情页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../renderer";
import ApiDataFilter from "../../../../system/libraries/apiDataFilter";

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
        let modulePathArray = [  "community" , "same" ] ;
        let apiPathArray = [ "community" , "sameEstateHouseList" ] ;
        try{
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            调用接口获取数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let adf = new ApiDataFilter(this.req.app);
            let regionId  = this.req.params.regionId || 46; //板块Id
            let cityPinYin = this.req.params.city || "shanghai"; // 城市pinyin
            let cityInfo = await adf.request({     // 通过拼音获取城市信息
                "apiPath" : cityPathArray.join(".") ,
                "data" : { "pinyin" : cityPinYin }
            }) ;
            let apiData = await adf.request({
                "apiPath" : apiPathArray.join(".") ,
                "method":"post",
                "contentType":"application/json",
                "data" : { "subEstateId" : regionId}
            }) ;
            if (apiData.data && apiData.data.length>0){
                apiData.data.forEach((iteme , index)=>{
                    apiData.data[index]['url']=`/${this.req.params.city }/esf/${iteme.encryptHouseId}.html`
                })
            }
            let item = {
                houseList:apiData.data,
                cityPY:cityPinYin,
                cityName : cityInfo.data.cityName,
                regionId: regionId,
                channel:"",
            };
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" : "租房-悟空找房" ,
                "keywords" :  "租房，真实房屋出租" ,
                "description" : "悟空找房网为您提供" ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/") ,
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