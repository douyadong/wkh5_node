/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> xf -> detail -> renderer.js
3. 作者：tangxuyang@lifang.com
4. 备注：新房详情页面渲染器
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
        获取encryptSubEstateId 获取city并给出默认值
        测试环境encryptSubEstateId：22292 22405 22409 24021 24534 24640
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/ 
        this.encryptSubEstateId = this.req.params.encryptSubEstateId || 81515 ;
        this.cityPinyin = this.req.params.city || "shanghai" ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        渲染模板
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/       
        this.renders() ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    渲染页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    async renders() {
        let modulePathArray = [ "xf" , "detail" ] ;
        try {
            let adf = new ApiDataFilter(this.req.app) ;               
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            获取api数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let apiData = await adf.request({
                "apiPath" : modulePathArray.join(".") ,
                "method" : "post" ,
                "contentType" : "application/json" ,
                "data" : { "encrptySubEstateId" : this.encryptSubEstateId , "cityPY" : this.cityPinyin }
            }) ;            
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            api数据分拣
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
             let estateModel = apiData.data.newHouseDetailModel ;
             let cityModel = apiData.data.cityBusinessModel ;
             let aroundXfModel = apiData.data.aroundNewHouseList ;
             /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            相册的视频和图片的数据的组装处理
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/            
            estateModel['imgList'] = this.recombingAlbumData({ apiData : estateModel , city : this.cityPinyin , pictKey : "imageList" }) ;            
             /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            对周边楼盘数据进行：
            1.  bigDataParams以及url的处理
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            aroundXfModel && aroundXfModel.length && aroundXfModel.forEach((aroundXf) => {
                aroundXf.url = aroundXf.encryptSubEstateId + ".html" ;
                
                aroundXf.bigDataParams = this.generateBigDataParams( { "eventName" : 1045015 , "eventParam" : { "new_house_id" : estateModel.id } } ) ;
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            要给每个户型图赋予大数据埋点
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            estateModel && estateModel.houseTypeImages && estateModel.houseTypeImages.forEach((layout) => {
                layout.bigDataParams = this.generateBigDataParams( { "eventName" : 1045013 , "eventParam" : { "new_house_id" : estateModel.id , "house_image_id" : layout.id } } ) ;
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            对城市的字段进行处理（去掉"市"字）
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let shortName = this.throwShiSuffix(cityModel.cityName) ;                   
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" : estateModel.estateName + "-新房出售-悟空找房" ,
                "keywords" : estateModel.estateName + "," + shortName + estateModel.estateName + ",新房出售" ,
                "description" : estateModel.estateName + "新房出售,买" + estateModel.estateName + "新房，了解更多关于新楼盘详情信息就上" + shortName + "悟空找房网，百分百真实房源。"  ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/") , 
                "item" : estateModel ,
                "cityName" : shortName ,  //download-app里面有一个变量叫cityName
                "cityPinyin" : this.cityPinyin
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            大数据埋点参数
            @dynamicTotalClick 这个key的埋点参数在系统里面找不到
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData , {
                "bigDataParams" : {
                    "albumPictClick" : this.generateBigDataParams( { "eventName" : 1045012 , "eventParam" : { "new_house_id" : estateModel.id } } ) ,
                    "loanCalClick" : this.generateBigDataParams( { "eventName" : 1045007 , "eventParam" : { "new_house_id" : estateModel.id } } ) ,
                    "magazineMoreClick" : this.generateBigDataParams( { "eventName" : 1045011 , "eventParam" : { "new_house_id" : estateModel.id } } ) ,
                    "dynamicTotalClick" : this.generateBigDataParams( { "eventName" : 1045001 , "eventParam" : { "new_house_id" : estateModel.id } } ) ,                    
                    "baseinfoMoreClick" : this.generateBigDataParams( { "eventName" : 1045002 , "eventParam" : { "new_house_id" : estateModel.id } } ) ,
                    "mapClick" : this.generateBigDataParams( { "eventName" : 1045004 , "eventParam" : { "new_house_id" : estateModel.id } } ) ,
                    "consultClick" : this.generateBigDataParams( { "eventName" : 1045020 , "eventParam" : { "new_house_id" : estateModel.id } } ) ,
                    "clickGoCommentBigDataParams" : this.generateBigDataParams({ "eventName": 1045064, "eventParam": { new_house_id : estateModel.id } }),
                }
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            api数据赋予模板
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData , {
                "item" : estateModel ,
                "commentGroupModel" : apiData.data.commentGroupModel ,
                "aroundNewHouseList" : aroundXfModel
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