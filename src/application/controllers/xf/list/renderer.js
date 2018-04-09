/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：wkh5
2. 文件名：src -> application -> controllers -> xf -> list -> renderer.js
3. 作者：tangxuyang@lifang.com
4. 备注：新房列表页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../renderer" ;
import ApiDataFilter from "../../../../system/libraries/apiDataFilter" ;
import UrlParser from "../../../../system/libraries/urlParser" ;
import guID from "../../../../system/libraries/guId" ;
import ParamGenerator from "./ParamGenerator";
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
创建一个渲染器实例
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

class Renderer extends AppRendererControllerBasic {
    constructor(req, res, next) {
        super(req, res, next);
        this.renders();
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    渲染页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    async renders() {        
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        定义模块路径，方便调用
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        let modulePathArray =  [ "xf" , "list" ] ; // 渲染的页面        
        try{    
            // 解析查询条件
            let adf = new ApiDataFilter(this.req.app) ;
            let urlParser = new UrlParser(this.req.originalUrl); // new一个url处理的对象
            
            let param ={
                cityId: 43/*cityId*/,
                pageSize: 10
            };

            let data = null;

            // 如果有查询条件，按照查询条件加载数据，否则不加载数据
            if(this.req.params.condition){                
                let conditionObj = urlParser.parseCondition({condition: this.req.params.condition});             
                param = this.generateParams(conditionObj, param);                
                
            }else{
                // do nothing
            }            

            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            通过拼音获取城市相关信息       
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let cityData = await adf.request({"apiPath" : "common.cityPinYin" , "data" : { "pinyin" : this.req.params.city } }) ;
            let cityModel = null;
            let defaultCityModel = {
                "cityId":43,
                "cityPinyin":"shanghai",
                "cityName":"上海",
                "oldBusiness":true,
                "newBusiness":true,
                "rentBusiness":true,
                "china":true,
                "cityOpen": true
            };
            
            if(cityData && cityData.data && cityData.data.cityId){            
                cityModel = cityData.data ;
                cityModel.cityOpen = cityModel.newBusiness ;                
            }else{                
                // 跳转到上海
                this.res.redirect('/shanghai/xflist/');
                return;
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            根据PRD的要求，如果用户先前访问过H5的某个城市，某些特定场景需要直接跳转到访问过的城市页面，而且不能用FE做跳转，否则就出现先出现路由城市数据，同步
            渲染完后再有前端JS读取cookie进行比较然后跳转到先前访问过的城市，这会产生视觉上的跳转，产品经理不要这个跳转，所以要在node层进行redirect
            本身这块逻辑应该在FE的定位逻辑一起的，现在被逼在这里也要放一套，坑爹啊！
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            if( this.req.cookies.visitedCityId && this.req.cookies.visitedCityId != cityModel.cityId && this.req.cookies.selectedCityId && this.req.cookies.selectedCityId != cityModel.cityId ) {
                console.log("先前访问过H5城市，并且选择过城市，这两个城市值都不等于路由城市，所以跳转到先前访问城市") ;
                this.res.redirect("/" + this.req.cookies.visitedCityPinyin + "/xflist" ) ;
                return ;
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            坑爹适配结束
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/      

            Object.assign(this.templateData, { "cityModel" : cityModel }) ;
            param.cityId = cityModel.cityId;
            let channel = this.req.query.channel;

            if(cityModel.cityOpen){
                data = await adf.request({
                    "apiPath" : modulePathArray.join("."),
                    "data" : param,
                    "method":"post",
                    "contentType":"application/json"
                }) ;
    
                // 遍历添加bigDataParams            
                if(data && data.data && data.data.newHouseDataListModelList){
                    data.data.newHouseDataListModelList.forEach(function(item){
                        item.url = "/" + cityModel.cityPinyin + "/xf/" + item.encryptSubEstateId + ".html" + (channel&&"?channel=" + channel||"");
                        item.bigDataParams = encodeURIComponent('{"eventName": "1050025", "eventParam": { "new_house_id": "'+item.subEstateId+'" } }');
                        item.hasVideo = parseInt(item.hasVideo) || 0;
                    });
                }
            }            

            Object.assign(this.templateData, {                 
                "matchStylesheetPath" : modulePathArray.join("/"),
                "controllerJavascriptPath" : modulePathArray.join("/"),
                "data": data,
                "channel": channel,
                "title": cityModel.cityName + "新楼盘_" + cityModel.cityName + "买新房_新房交易_" + cityModel.cityName + "新开楼盘信息-悟空找房",
                "keywords": cityModel.cityName + "新楼盘,"+ cityModel.cityName +"新开盘房源出售," + cityModel.cityName + "新房,"+ cityModel.cityName +"新开楼盘交易",
                "description": "悟空找房网为您提供"+cityModel.cityName+"新开楼盘的最新信息，各区域的新楼盘房源出售信息这里都能找到，想要关注更多"+cityModel.cityName+"新楼盘信息尽在悟空找房，这里有真实可靠的房源、真诚的服务、安全的交易，让"+cityModel.cityName+"新楼盘交易买卖变得高效又安全。"
            }) ;      

            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            埋点参数配置 
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "bigDataParams" : {
                    "conningTower" : {
                        "search" : this.generateBigDataParams( { "eventName" : 1068017 , "eventParam" : {} } ) ,
                        "hamburg" : this.generateBigDataParams( { "eventName" : 1068027 , "eventParam" : {} } ) ,
                        "clearSearchHistory" : this.generateBigDataParams( { "eventName" : 1068015 } )
                    }
                }
            }) ;

            this.render(modulePathArray.join("/")) ;
        }catch (err){
            this.next(err)
        }
    }

    // 根据查询条件生成后端接口需要的查询参数
    generateParams(conditionObj, initObj) {

        return new ParamGenerator({
            of: function(ret, data){
                ret.offset = 0;
                ret.pageSize = data;
            }
        }).getParamObj(conditionObj, initObj);
    }
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;