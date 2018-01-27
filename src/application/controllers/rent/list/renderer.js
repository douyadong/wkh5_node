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
import guID from "../../../../system/libraries/guId" ;
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
        let modulePathArray =  [ "rent" , "list" ] ; // 渲染的页面
        let errPathArray = [ "seo" , "exception" ] ; // 渲染的页面
        let rentListPathArray = ["rent" , "list", "rentHouseList"]; // 租房列表接口
        let guessLikeHouse = ["rent" , "list", "guessLikeHouse"]; // 猜你喜欢接口
        let cityPinYin = ["rent" , "list", "cityPinYin"];   // 用pinyin获取cityId
        try{
            let conditionGet = new UrlParser(this.req.originalUrl); // new一个url处理的对象
            let guId = new guID();   // new一个产生guid的对象
            let adf = new ApiDataFilter(this.req.app) ;
            let conditionData = {};
            let cityId = 43 ;
            let pinyin = {
                "pinyin": this.req.params.city || "shanghai"
            };
                let cityInfo = await adf.request({
                    "apiPath" : cityPinYin.join("."),
                    "data" : pinyin ,
                }) ;
            cityId = cityInfo.cityId || 43;
            this.res.cookie('cityId', cityInfo.cityId || 43, {httpOnly: false}); // 设置cityId
            this.res.cookie('cityName', cityInfo.cityName || "上海", {httpOnly: false});// 设置cityName
            this.res.cookie('pinyin', cityInfo.cityPinyin || "shanghai", {httpOnly: false});// 设置城市pinyin
            this.res.cookie('citySelectionOpen', "" , {httpOnly: false}); // 首次进入租房列表页设置标识（在城市列表页不选择城市但返回的时候用到判断标识）
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            根据params.condition和query的值的情况重新组装数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            if (this.req.params.condition) {
                    let conditionString = this.req.params.condition;
                    let newConditionString  = conditionString.replace("to","townId").replace("li","subwayLine").replace("st","subwayStation");
                    let conditionObj =  conditionGet.parseCondition({condition:newConditionString});
                    let spaceAreaStart =["0-50","50-70","70-90","90-110","110-130","130-150","150-0"];
                    conditionData = {
                        "cityId":cityId,
                        "pageSize":10,
                        "bedRoomSumLists":[],
                        "renovations":[],
                        "spaceAreas":[]
                    };
                    if(conditionObj['la'] && conditionObj['la'].length == 1){  // 判断是对象还是数组
                        console.log("conditionObj['la']================="+conditionObj['la']);
                        if(conditionObj['la'] == 0){
                            conditionData['bedRoomSumLists'] =[];
                        }else {
                            conditionData['bedRoomSumLists'].push(conditionObj['la'])
                        }
                    }else {
                        conditionData['bedRoomSumLists'] = conditionObj['la']
                    }
                    delete(conditionObj['la']);
                    if (conditionObj['pr']) {   // 价格选择
                        if(conditionObj['pr'].constructor == Array) {
                            conditionData["rentPriceStart"]= conditionObj['pr'][0];
                            conditionData["rentPriceEnd"]= conditionObj['pr'][1]
                        }else {
                            conditionData["rentPriceStart"]= conditionObj['pr']
                        }
                    }
                    delete(conditionObj['pr']);
                    if (conditionObj['cp']){  // 价格自定义
                        let cpArray = conditionObj['cp'].split("townId");
                  /*      if (cpArray[0] == 0){
                            conditionData["rentPriceEnd"]= cpArray[1]  //价格
                        }else if(cpArray[1] == 0){
                            conditionData["rentPriceStart"]= cpArray[0] //价格
                        }else {*/
                            conditionData["rentPriceStart"]= cpArray[0];
                            conditionData["rentPriceEnd"]= cpArray[1]
                   /*     }*/
                    }
                    delete(conditionObj['cp']);
                    if (conditionObj['ta']){
                        conditionData["isSubWay"] = conditionObj['ta'][0];  // 近地铁 0 任意  1 是
                        conditionData["priceDown"] = conditionObj['ta'][1]; // 降价  0 否  1 是
                        conditionData["isNewOnStore"] = conditionObj['ta'][2]; // 新上 0：否 1：是，
                        conditionData["orientation"] = conditionObj['ta'][3]; // 房屋朝向 1南北通透 0任意
                    }
                    delete(conditionObj['ta']);
                    if (conditionObj['ar']) {   // 面积选择
                        if(conditionObj['ar'].length == 1) {
                            conditionData["spaceAreas"].push(spaceAreaStart[conditionObj['ar']])
                        }else {
                            conditionObj['ar'].forEach(function (item) {
                                conditionData["spaceAreas"].push(spaceAreaStart[item])
                            });
                        }
                    }
                    delete(conditionObj['ar']);
                    if (conditionObj['dt']) {  // 装修状况
                        if (conditionObj['dt'].length == 1){
                            conditionData["renovations"].push(conditionObj['dt'])
                        }else {
                            conditionData["renovations"] = conditionObj['dt'];
                        }

                    }
                    delete(conditionObj['dt']);
                    if (conditionObj['so']) { // 排序
                        conditionData["orderType"] = conditionObj['so'];
                    }
                    delete(conditionObj['so']);
                    if (conditionObj['di']){ // 区域
                        conditionData["districtId"] =conditionObj['di']
                    }
                    delete(conditionObj['di']);
                Object.assign(conditionData,conditionObj) ;
            }else {
                conditionData = {
                    "cityId":cityId,
                    "pageSize":10
                };
            }
            if (this.req.query){
                if (this.req.query['districtId']){  // 查询？后面参数异步请求
                    conditionData['districtId'] = this.req.query['districtId'];
                }else if (this.req.query['townId']){
                    conditionData['townId'] = this.req.query['townId'];
                }else if (this.req.query['subwayLine']){
                    conditionData['subwayLine'] = this.req.query['subwayLine'];
                }else if (this.req.query['subwayStation']){
                    conditionData['subwayStation'] = this.req.query['subwayStation'];
                }else if (this.req.query['subEstateId']){
                    conditionData['subEstateId'] = this.req.query['subEstateId'];
                }
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据  租房列表
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

            let apiDat = await adf.request({
                "apiPath" : rentListPathArray.join("."),
                "data" : conditionData,
                "method":"post",
                "contentType":"application/json"
            }) ;
            let item = apiDat;
            if (item.data){
                item.data.forEach((itemI, index) =>{
                    item.data[index]['url']="/shanghai/rent/"+itemI.encryptHouseId+".html";
                    item.data[index]['bigDataParams'] = this.generateBigDataParams({ eventName:'1202021',eventParam:{rent_house_id:itemI.houseId }, type: 2})
                })
            }
            let pageData={};  // 定义页面储存的对象变量值不限
            pageData['priceList'] = ['0', '1000', '1000 - 2000', '2000 - 4000', '4000 - 6000', '6000 - 8000','8000 - 10000','10000']; // 租房价格索引展示值
            pageData['layout'] = ['不限', '一室', '二室', '三室', '四室', '五室及以上'];  // 租房户型索引展示值
            item['pageData']= pageData;    //  静态页面展示值赋值给一个变量
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据  租房猜你喜欢列表
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let cookieId ='';
            if(this.req.cookies.cookieId){
                cookieId = this.req.cookies.cookieId
            }else if (this.req.cookies.guId){
                cookieId = this.req.cookies.guId
            }else {
                cookieId = guId.guid();
                this.res.cookie('cookieId', cookieId, { expires: new Date(Date.now() + 9999999990000), httpOnly: false  })
            }
            let guessLikeHouseData = {
                "cityId":cityId,
                "guId": cookieId
            };
            if (item.count < 1 ){
                let apiSimilarData = await adf.request({
                    "apiPath" : guessLikeHouse.join("."),
                    "data" : guessLikeHouseData,
                }) ;
                item['guessLikeHouse'] = apiSimilarData;
                if (item.guessLikeHouse.data){
                    item.guessLikeHouse.data.forEach((itemI, index)=> {
                        item.guessLikeHouse.data[index]['url']="/shanghai/rent/"+itemI.encryptHouseId+".html";
                        item.guessLikeHouse.data[index]['bigDataParams']=this.generateBigDataParams({ eventName:'1202039',eventParam:{rent_house_id:itemI.houseId }, type: 2})
                    })
                }
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
           大数据埋点参数
           -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            item['DataParams'] ={
                // 点击搜索框
                searchD:this.generateBigDataParams({
                    eventName: '1202022',
                    type: 2
                }),
                // 点击区域筛选
                areasD : this.generateBigDataParams({
                    eventName: '1202023',
                    type: 2
                }),
                // 点击租金筛选
                rentPD : this.generateBigDataParams({
                    eventName: '1202024',
                    type: 2
                }),
                // 点击租金-自定义-确定
                rentSelfPD : this.generateBigDataParams({
                    eventName: '1202025',
                    type: 2
                }),
                //点击户型筛选
                typeD : this.generateBigDataParams({
                    eventName: '1202026',
                    type: 2
                }),
                //点击户型-确定
                typeCoD : this.generateBigDataParams({
                    eventName: '1202027',
                    type: 2
                }),
                //点击更多筛选
                moreD : this.generateBigDataParams({
                    eventName: '1202028',
                    type: 2
                }),
                //点击更多-确定
                moreCoD : this.generateBigDataParams({
                    eventName: '1202029',
                    type: 2
                }),
                //点击更多-重置
                moreRD : this.generateBigDataParams({
                    eventName: '1202030',
                    type: 2
                }),
                //点击排序按钮
                sortD : this.generateBigDataParams({
                    eventName: '1202031',
                    type: 2
                }),
                //点击排序-默认排序
                sortDefD : this.generateBigDataParams({
                    eventName: '1202032',
                    type: 2
                }),
                //点击排序-租金从低到高
                sortltD : this.generateBigDataParams({
                    eventName: '1202033',
                    type: 2
                }),
                //点击排序-租金从高到底
                sorttlD : this.generateBigDataParams({
                    eventName: '1202034',
                    type: 2
                }),
                //点击排序-面积从大到小
                sortsqD : this.generateBigDataParams({
                    eventName: '1202035',
                    type: 2
                }),
                //点击排序-面积从小到大
                sortSbD : this.generateBigDataParams({
                    eventName: '1202036',
                    type: 2
                }),
                //点击排序-发布时间从近到远
                sortTimeD : this.generateBigDataParams({
                    eventName: '1202037',
                    type: 2
                }),
                //筛选无结果点击清除条件按钮
                clearD : this.generateBigDataParams({
                    eventName: '1202038',
                    type: 2
                }),
                //搜索历史清除
                clearHistoryD : this.generateBigDataParams({
                    eventName: '1203006',
                    type: 2
                }),
            };
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
           城市的名称获取
           -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            item['cityName'] =this.req.cookies.userSelectedCityName || this.req.cookies.location_cityName || "上海";
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            渲染模板
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            if (item.status == 1){
                Object.assign(this.templateData, {
                    "title" :"租房" ,
                    "matchStylesheetPath" : modulePathArray.join("/") ,
                    "controllerJavascriptPath" : modulePathArray.join("/"),
                    "item" : item ,
                }) ;
                this.render(modulePathArray.join("/")) ;
            }else {
                Object.assign(this.templateData, {
                    "title" :"租房" ,
                    "matchStylesheetPath" : errPathArray.join("/") ,
                    "controllerJavascriptPath" : errPathArray.join("/"),
                    "item" : item ,
                }) ;
                this.render(errPathArray.join("/")) ;
            }

        }catch (err){
            this.next(err)
        }
    }
}

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;