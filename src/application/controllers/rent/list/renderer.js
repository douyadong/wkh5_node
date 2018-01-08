/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：wkh5
2. 文件名：src -> application -> controllers -> rent -> list -> renderer.js
3. 作者：liyang@lifang.com
4. 备注：租房列表页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../renderer" ;
import ApiDataFilter from "../../../../system/libraries/apiDataFilter" ;
import UrlParser from "../../../../system/libraries/urlParser" ;

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
        let modulePathArray = [ "rent" , "list" ] ;
        let rentListPathArray = ["rent" , "list", "rentHouseList"];
        let guessLikeHouse = ["rent" , "list", "guessLikeHouse"];
        try{
            let conditionGet = new UrlParser(this.req.originalUrl);
            let conditionString = this.req.params.condition;
            let newConditionString  = conditionString.replace("di","districtId").replace("to","townId").replace("li","subwayLine").replace("st","subwayStation");
            let conditionObj =  conditionGet.parseCondition({condition:newConditionString});
            let conditionData = {
                "cityId":"3",
                "bedRoomSumLists":[],
            };
            if(conditionObj['la'] && conditionObj['la'].length == 1){  // 判断是对象还是数组
                conditionData['bedRoomSumLists'].push(conditionObj.la)
            }else {
                conditionData['bedRoomSumLists'] = conditionObj['la']
            }
            delete(conditionObj['la']);
            if (conditionObj['pr']) {   // 价格选择
                if(conditionObj['pr'].length == 1) {
                    conditionData["rentPriceStart"]= conditionObj['pr'][0]
                }else {
                    conditionData["rentPriceStart"]= conditionObj['pr'][0];
                    conditionData["rentPriceEnd"]= conditionObj['pr'][1]
                }
            }
            delete(conditionObj['pr']);
            if (conditionObj['cp']){  // 价格自定义
              let cpArray = conditionObj['cp'].split("townId");
              if (cpArray[0] == 0){
                  conditionData["rentPriceEnd"]= cpArray[1]  //价格
              }else if(cpArray[1] == 0){
                  conditionData["rentPriceStart"]= cpArray[0] //价格
              }else {
                  conditionData["rentPriceStart"]= cpArray[0];
                  conditionData["rentPriceEnd"]= cpArray[1]
              }
            }
            delete(conditionObj['cp']);
            conditionData["isSubWay"] = conditionObj['ta'][0];  // 近地铁 0 任意  1 是
            conditionData["priceDown"] = conditionObj['ta'][1]; // 降价  0 否  1 是
            conditionData["isNewOnStore"] = conditionObj['ta'][2]; // 新上 0：否 1：是，
            conditionData["orientation"] = conditionObj['ta'][3]; // 房屋朝向 1南北通透 0任意
            delete(conditionObj['ta']);
            if (conditionObj['ar']) {   // 面积选择
                if(conditionObj['ar'].length == 1) {
                    conditionData["spaceAreaStart"]= conditionObj['ar'][0]
                }else {
                    conditionData["spaceAreaStart"]= conditionObj['ar'][0];
                    conditionData["spaceAreaEnd"]= conditionObj['ar'][1]
                }
            }
            delete(conditionObj['ar']);
            if (conditionObj['dt']) {
                conditionData["renovation"] = conditionObj['dt'];   // 装修状况
            }
            delete(conditionObj['dt']);
            if (conditionObj['so']) {
                conditionData["orderType"] = conditionObj['so'];   // 装修状况
            }
            delete(conditionObj['so']);
            Object.assign(conditionData,conditionObj) ;
            console.log(conditionData);

            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据  租房列表
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let adf = new ApiDataFilter(this.req.app) ;
            let apiDat = await adf.request({
                "apiPath" : rentListPathArray.join("."),
                "data" : conditionData,
                "method":"post",
                "contentType":"application/json"
            }) ;
            let item = apiDat;
            let pageData={};  // 定义页面储存的对象变量值不限
            pageData['priceList'] = ['0', '1000', '1000 - 2000', '2000 - 4000', '4000 - 6000', '6000 - 8000']; // 租房价格索引展示值
            pageData['layout'] = ['不限', '一室', '二室', '三室', '四室', '五室及以上'];  // 租房户型索引展示值
            item['pageData']= pageData;    //  静态页面展示值赋值给一个变量
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据  租房猜你喜欢列表
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

    /*        if (item.count <1 ){
                let apiSimilarData = await adf.request({
                    "apiPath" : guessLikeHouse.join("."),
                    "data" : conditionData,
                }) ;
                item['guessLikeHouse'] = apiSimilarData;
            }*/
            // 额外的脚本样式
            let  extraJavascript = [this.templateData.utilStaticPrefix+'/wkzf/js/util/jquery.cookie.min.js'];
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
           扩展模板常规数据
           -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" :"租房" ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/"),
                "extraJavascripts" : extraJavascript ,
                "item" : item ,
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            渲染模板
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            this.render(modulePathArray.join("/")) ;
        }catch (err){
            this.next(err)
        }

    }
}

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;