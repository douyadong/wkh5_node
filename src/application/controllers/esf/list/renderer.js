/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> esf -> list -> renderer.js
3. 作者：zhaohuagang@lifang.com
4. 备注：二手房列表页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../renderer" ;
import ApiDataFilter from "../../../../system/libraries/apiDataFilter" ;
import UrlParser from "../../../../system/libraries/urlParser" ;
import guID from "../../../../system/libraries/guId" ;
import ParamGenerator from "../../xf/list/ParamGenerator";
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
        let modulePathArray = [ "esf" , "list" ] ;
        try {
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            载入ApiDataFilter工具
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let adf = new ApiDataFilter(this.req.app) ;           
            let urlParser = new UrlParser(this.req.originalUrl); // new一个url处理的对象
            let channel = this.req.query.channel;

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
            扩展模板常规数据            
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" : "二手房列表" ,
                "keywords" : "" ,
                "description" : "" ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/")
            }) ;
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
                cityModel.cityOpen = cityModel.oldBusiness ;                
            }else{                
                // 跳转到上海
                this.res.redirect('/shanghai/esf/' + (channel&&("?channel="+channel)||""));
                return;
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            根据PRD的要求，如果用户先前访问过H5的某个城市，某些特定场景需要直接跳转到访问过的城市页面，而且不能用FE做跳转，否则就出现先出现路由城市数据，同步
            渲染完后再有前端JS读取cookie进行比较然后跳转到先前访问过的城市，这会产生视觉上的跳转，产品经理不要这个跳转，所以要在node层进行redirect
            本身这块逻辑应该在FE的定位逻辑一起的，现在被逼在这里也要放一套，坑爹啊！
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            if( this.req.cookies.visitedCityId && this.req.cookies.visitedCityId != cityModel.cityId && this.req.cookies.selectedCityId && this.req.cookies.selectedCityId != cityModel.cityId ) {
                console.log("先前访问过H5城市，并且选择过城市，这两个城市值都不等于路由城市，所以跳转到先前访问城市") ;
                this.res.redirect("/" + this.req.cookies.visitedCityPinyin + "/esf" +(channel&&("?channel=" + channel)||"") ) ;
                return ;
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            坑爹适配结束
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

            Object.assign(this.templateData, { "cityModel" : cityModel }) ;
            param.cityId = cityModel.cityId;
            
            if(cityModel.cityOpen){// 只在开通业务时才发请求获取列表数据
                data = await adf.request({
                    "apiPath" : modulePathArray.join("."),
                    "data" : param,
                    "method":"post",
                    "contentType":"application/json"
                }) ;
    
                // 处理data给每个条目添加url和bigDataParams                
                if(data && data.data && data.data.houseList){
                    data.data.houseList.forEach(function(item){
                        item.url = "/"+cityModel.cityPinyin+"/esf/"+item.encryptHouseId+".html"+(channel&&"?channel="+channel||"");
                        item.bigDataParams = encodeURIComponent('{"eventName": "1068028", "eventParam": {"house_id": "'+item.houseId+'"}}');
                    });
                }
            } 
           
            Object.assign(this.templateData, {                 
                "matchStylesheetPath" : modulePathArray.join("/"),
                "controllerJavascriptPath" : modulePathArray.join("/"),
                "data": data,
                "channel": channel
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
                },
                "title": cityModel.cityName + "二手房交易_"+cityModel.cityName+"二手房房源出售信息_"+cityModel.cityName+"二手房买卖-悟空找房",
                "description": cityModel.cityName + "二手房，"+cityModel.cityName+"二手房交易，二手房买卖，"+cityModel.cityName+"二手房房源出售信息",
                "keywords": "悟空找房网二手房网专业为您整合"+cityModel.cityName+"各地区的二手房房源和各区域二手房房源的买卖出售信息,"+cityModel.cityName+"地铁房二手房在售信息，全"+cityModel.cityName+"的二手房房源信息在这里都应有尽有，买二手房就上"+cityModel.cityName+"悟空找房网，真实可靠的房源、真诚的服务、安全的交易，让二手房买卖变得高效又安全。"
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