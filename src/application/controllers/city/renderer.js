/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> city -> renderer.js
3. 作者：liyang@lifang.com
4. 备注：城市列表
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../renderer" ;
import ApiDataFilter from "../../../system/libraries/apiDataFilter" ;
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
        let modulePathArray = ["city", "list"];
        let cityListPathArray = ["common" , "cityList"]; // 城市列表接口
        try {
            let adf = new ApiDataFilter(this.req.app) ;
            let businessType = this.req.query['businessType'];  // 获取query参数
            let location_cityName = '';
            let location_cityPinyin = "";
            let location_cityId = "";
            if(this.req.cookies && this.req.cookies.location_cityName) {
                location_cityName = this.req.cookies.location_cityName;
                location_cityPinyin = this.req.cookies.location_cityPinyin;
                location_cityId = this.req.cookies.location_cityId;
            }else {
                location_cityName="";
            }

            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据  城市列表
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let apiData = await adf.request({
                "apiPath" : cityListPathArray.join("."),
                "method":"post",
                "contentType":"application/json"
            }) ;
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            根据来源是否有相应的模块业务，判断国际是否显示
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            let businessId = '';
            let overseaBusinessFlag = false;
            if (businessType== "old") {
                businessId = 1
            } else if (businessType == "new") {
                businessId = 3
            } else if (businessType == "rent") {
                businessId = 2
            } else if(businessType == "xfPrice") {
                businessId = 3
            }else if(businessType == "esfPrice") {
                businessId = 1
            }
            apiData.overseaCityList.forEach((item)=>{
                if (item.businessList){
                    item.businessList.forEach((itemB)=>{
                        if (businessId == itemB.businessId){
                            overseaBusinessFlag = true;
                        }
                    })
                }
            });

            let itemData = {
                domesticCityList: this.reSortData(apiData.domesticCityList,businessId),
                overseaCityList: this.reSortData(apiData.overseaCityList,businessId)
            };
            let item = itemData;
            item['overseaBusinessFlag'] = overseaBusinessFlag;
            item['location_cityName'] = location_cityName;
            item['location_cityPinyin'] = location_cityPinyin;
            item['location_cityId']= location_cityId;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title": "二手房_买卖房屋_房产网-悟空找房",
                "keywords": "二手房,新房,租房,买房,卖房,房产网,房价",
                "description": "悟空找房网为您提供了全国100多个城市的房产信息，整合了全国多个城市的二手房，新房，租房，商铺，写字楼，公寓，地铁房等最新房产消息，找房，查询全国各城市房价，买卖二手房就上悟空找房网，百分百真实房源。",
                "matchStylesheetPath": modulePathArray.join("/"),
                "controllerJavascriptPath": modulePathArray.join("/"),
                "item" : item ,
            });
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            渲染模板
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            this.render(modulePathArray.join("/"));
        }
        catch (ex) {
            this.next(ex);
        }
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    整理归纳城市列表，重构数据结构
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    reSortData(cityList,businessId) {
        let domesticPinYin = [];
        let domesticCityList = [];
        if (cityList) {
            cityList.forEach((item, index) => { // 取出所有首字母
                let firstW = item.pinyin.substr(0, 1).toUpperCase();
                domesticPinYin.push(firstW);
            });
            const domesticCity = new Set(domesticPinYin); // 去重
            [...domesticCity].forEach((item) => {
                let city = {
                    firstWord: item,
                    cityList: []
                };
                domesticCityList.push(city)
            });
            domesticCityList.forEach((itemA, indexA) => {   // 循环对比赋值
                cityList.forEach((item, index) => {
                    let firstW = item.pinyin.substr(0, 1).toUpperCase();
                    item.businessList.forEach((itemBus)=>{
                        if (itemA.firstWord == firstW && itemBus.businessId == businessId) {
                            domesticCityList[indexA].cityList.push(item)
                        }
                    });
                });
            });
            domesticCityList =  domesticCityList.filter((item)=>{
               return item.cityList.length > 0
           })
        }

        return domesticCityList
    }
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;