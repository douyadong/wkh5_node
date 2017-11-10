/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> community -> detail -> renderer.js
3. 作者：tangxuyang@lifang.com
4. 备注：小区详情页面渲染器
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
        this.renders() ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    渲染页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    async renders() { 
        let subEstateId = this.req.params.subEstateId || "" ;   //加密的houseId
        let modulePathArray = [ "community" , "detail" ] ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        调用接口获取数据
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/  
        let adf = new ApiDataFilter(this.req.app) ;         
        let apiData = await adf.request({
            "apiPath" : modulePathArray.join(".") ,
            "data" : { "subEstateId" : subEstateId }
        }) ;        
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        处理返回数据供模板使用
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        let item = apiData.data;
        var imgList = [];
        //合并视频和图片
        if(item.imgList && item.imgList.length > 0){
            for(let i = 0; i < item.imgList.length; i++){
                imgList.push({
                    url: item.imgList[i]
                });
            }
        }
        item.imgList = imgList;
        
        //地图跳转路径
        item.mapUrl = this.templateData.domain + '/esf/map.html?longitude=' + item.longitude + '&latitude=' + item.latitude + '&houseName=' + item.subEstateName + '&houseAddress=' + item.estateAddr;  
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        小区名称和城市名称存起来，多用
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        let estateName = apiData.data.estateName ;
        let cityName = apiData.data.cityName ;
        if(cityName && cityName.charAt(cityName.length - 1) === "市") {
            cityName = cityName.substring( 0 , cityName.length - 1) ;
        }
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        扩展模板常规数据
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        Object.assign(this.templateData, { 
            "title" : estateName + "房价_" + cityName + estateName + "租房-悟空找房" , 
            "keywords" : estateName + "，" + estateName + "房价，" + estateName + "租房" ,
            "description" : "悟空找房网为您提供" + estateName + "的具体信息，查看" + cityName + estateName + "二手房，租房房源信息和周边配套设施，交通详情就上悟空找房网，百分百真实房源。" ,
            "wechatTitle" : apiData.data.weChatShare.title ,
            "wechatContent" : apiData.data.weChatShare.content ,
            "wechatImgUrl" : apiData.data.weChatShare.picUrl ,
            "item" : item ,
            "matchStylesheetPath" : modulePathArray.join("/") ,
            "controllerJavascript" : modulePathArray.join("/") 
        }) ;       
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        渲染模板
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/        
        this.render(modulePathArray.join("/")) ; 
    }
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;