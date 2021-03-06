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
        let cityPinYin = ["common" , "cityPinYin"];   // 用pinyin获取cityId
        try{
            let conditionGet = new UrlParser(this.req.originalUrl); // new一个url处理的对象
            let guId = new guID();   // new一个产生guid的对象
            let adf = new ApiDataFilter(this.req.app) ;
            let meta={}; // meta展示
            let conditionData = {};
            let cityId = 43 ;   // 城市Id
            let pinyin = {      // 组装拼音接口需要的数据
                "pinyin": this.req.params.city || "shanghai"
            };
            let cityInfo = {};
            let defultName = this.req.cookies.selectedCityName;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            切换业务模块的情况下，由其他模块跳入租房业务，首先判断有客户选择城市有没有租房业务，没有就查看默认路由拼音是否支持租房业务，不支持跳到上海
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let rentBusinessSpurt = true;
            if(this.req.cookies && this.req.cookies.selectedCityPinyin) {  // 判断是否有客户选择的城市
                cityInfo = await adf.request({
                    "apiPath" : cityPinYin.join("."),
                    "data" : { "pinyin": this.req.cookies.selectedCityPinyin} ,
                }) ;
               if( cityInfo.data.rentBusiness ){
                   cityId =  cityInfo.data.cityId
               } else {     // 客户选择的城市不支持租房业务
          /*         cityInfo = await adf.request({
                       "apiPath" : cityPinYin.join("."),
                       "data" : pinyin ,
                   }) ;
                   if (cityInfo.data.rentBusiness ) {
                       cityId =  cityInfo.data.cityId;
                       defultName = cityInfo.data.cityName;
                   }else {      // 路由的不支持租房的业务 跳到上海
                       cityId = 43;
                       cityInfo['cityId']= cityId ;
                       cityInfo['cityName']= "上海" ;
                       cityInfo['cityPinyin']= "shanghai" ;
                       defultName = cityInfo.data.cityName;
                   }*/
                   rentBusinessSpurt = cityInfo.data.rentBusiness
               }
            }else {   // 没有用户选择的城市
                cityInfo = await adf.request({
                    "apiPath" : cityPinYin.join("."),
                    "data" : pinyin ,
                }) ;
                if (cityInfo.data.rentBusiness ){
                    cityId =  cityInfo.data.cityId;
                    defultName = cityInfo.data.cityName;
                }else {
                /*    cityId = 43;
                    cityInfo['cityId']= cityId ;
                    cityInfo['cityName']= "上海" ;
                    cityInfo['cityPinyin']= "shanghai" ;
                    defultName = cityInfo.data.cityName;*/
                    rentBusinessSpurt = cityInfo.data.rentBusiness
                }
            }
            this.res.cookie('cityId', cityInfo.data.cityId , {httpOnly: false}); // 设置cityId
            this.res.cookie('cityName', cityInfo.data.cityName , {httpOnly: false});// 设置cityName
            this.res.cookie('pinyin', cityInfo.data.cityPinyin , {httpOnly: false});// 设置城市pinyin
            this.res.cookie('citySelectionOpen', "" , { httpOnly: false}); // 首次进入租房列表页设置标识（在城市列表页不选择城市但返回的时候用到判断标识）
            this.res.cookie('location_noChose', "" , {httpOnly: false});// 避免循环跳转的标识
            this.res.cookie('visitedCityChina', cityInfo.data.china , {httpOnly: false});// 新房二手房 需要
            this.res.cookie('visitedCityName', cityInfo.data.cityName , {httpOnly: false});// 新房二手房 需要
            this.res.cookie('visitedCityId', cityInfo.data.cityId , {httpOnly: false});// 新房二手房 需要
            this.res.cookie('visitedCityPinyin', cityInfo.data.cityPinyin , {httpOnly: false});// 新房二手房 需要

            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            根据params.condition和query的值的情况重新组装数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            if (this.req.params.condition) {
                let conditionString = this.req.params.condition;
                let conditionObj = conditionGet.parseCondition({condition: conditionString});
                let spaceAreaStart = ["0-50","50-70","70-90","90-110","110-130","130-150","150-200","200-300","300-0"];
                conditionData = {
                    "cityId": cityId,
                    "pageSize": 10,
                    "bedRoomSumLists": [],
                    "renovations": [],
                    "spaceAreas": []
                };
                if (conditionObj['di']) { // 区域
                    conditionData["districtId"] = conditionObj['di']
                }
                if (conditionObj['to']) {   //town的获取赋值给接口需要的参数
                    conditionData['townId'] = conditionObj['to'];
                }
                if (conditionObj['li']) {  //地铁线路
                    conditionData['subwayLine'] = conditionObj['li'];
                }
                if (conditionObj['st']) {  // 地铁站点
                    conditionData['subwayStation'] = conditionObj['st'];
                }
                if (conditionObj['la']) {   // 房型检索条件
                    if (conditionObj['la'].constructor == Array) {
                        conditionData['bedRoomSumLists'] = conditionObj['la'];
                    } else {
                        conditionObj['la'] == 0 ? conditionData['bedRoomSumLists'] = [] : conditionData['bedRoomSumLists'].push(conditionObj['la']);
                    }
                }
                if (conditionObj['pr']) {   // 价格选择
                    if (conditionObj['pr'].constructor == Array) {
                        conditionData["rentPriceStart"] = conditionObj['pr'][0];
                        conditionData["rentPriceEnd"] = conditionObj['pr'][1]
                    } else {
                        conditionData["rentPriceStart"] = conditionObj['pr']
                    }
                }
                if (conditionObj['cp']) {  // 价格自定义
                    let cpArray = conditionObj['cp'].split("to");
                    conditionData["rentPriceStart"] = cpArray[0];
                    conditionData["rentPriceEnd"] = cpArray[1]
                }
                if (conditionObj['ta']) {
                    conditionData["isZeroCommission"] = conditionObj['ta'][0];  // 0佣金 0 否  1 是
                    conditionData["isSubWay"] = conditionObj['ta'][1];  // 近地铁 0 任意  1 是
                    conditionData["priceDown"] = conditionObj['ta'][2]; // 降价  0 否  1 是
                    conditionData["isNewOnStore"] = conditionObj['ta'][3]; // 新上 0：否 1：是，
                    conditionData["isShortRent"] = conditionObj['ta'][4]; // 新上 0：否 1：是，
                    conditionData["orientation"] = conditionObj['ta'][5]; // 房屋朝向 1南北通透 0任意
                }
                if (conditionObj['ar']) {   // 面积选择
                    if (conditionObj['ar'].constructor == Array) {
                        conditionObj['ar'].forEach(function (item) {
                            conditionData['spaceAreas'].push(spaceAreaStart[item])
                        });
                    } else {
                        conditionData['spaceAreas'].push(spaceAreaStart[conditionObj['ar']])
                    }
                }
                if (conditionObj['dt']) {   // 装修状况
                    if (conditionObj['dt'].constructor == Array) {
                        conditionData["renovations"] = conditionObj['dt'];
                    } else {
                        conditionData["renovations"].push(conditionObj['dt']);
                    }
                }
                if (conditionObj['so']) { // 排序
                    conditionData["orderType"] = conditionObj['so'];
                }
                if (conditionObj['ne']) { // 附近
                    conditionData["endMetres"] = conditionObj['ne'];
                    conditionData["localLon"] = this.req.cookies.location_longitude;
                    conditionData["localLat"] = this.req.cookies.location_latitude;
                    meta['title'] ='周边租房信息_附近整租合租出租屋-悟空找房';
                    meta['keywords'] ='整租，合租，附近租房，房东直租，周边租房信息';
                    meta['description'] ='悟空找房网为您提供您当前所在位置附近的整租、合租房房源信息，查看周边所有真实可靠的租房信息就上悟空找房网，百分百真实房源。';
                }
                if (conditionObj['er']) { // 租赁方式 整租
                    conditionData["isEntire"] = conditionObj['er'];
                    meta['title'] ='整租房_整租信息_房屋出租-悟空找房';
                    meta['keywords'] ='整租，上海租房，整屋出租';
                    meta['description'] ='悟空找房网为您提供真实可靠的整租房房源信息，查看一室一厅，两室一厅，三室一厅等整租房租房信息就上悟空找房网，百分百真实房源。';
                }
                if (conditionObj['fs']) { // 租赁方式 合租
                    conditionData["isShared"] = conditionObj['fs'];
                    meta['title'] ='合租房_合租信息_单间出租-悟空找房';
                    meta['keywords'] ='合租房，上海租房，单间出租';
                    meta['description'] ='悟空找房网为您提供真实可靠的合租房房源信息，查看大小单间出租屋租房信息就上悟空找房网，百分百真实房源。';
                }
            } else {
                conditionData = {
                    "cityId": cityId,
                    "pageSize": 10
                };
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
             查询query后面参数异步请求
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let channel= "";
            if (this.req.query){
                if (this.req.query['districtId']){
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
                if(this.req.query['channel']){
                    channel = this.req.query['channel'];
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
            if (item.count > 0){
                item.data.forEach((itemI, index) =>{
                    item.data[index]['url']="/"+ cityInfo.data.cityPinyin+"/rent/"+itemI.encryptHouseId+".html?channel="+ channel || "";
                    item.data[index]['bigDataParams'] = this.generateBigDataParams({ eventName:'1202021',eventParam:{rent_house_id:itemI.houseId }, channel:channel || "", type: 2})
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
            if(this.req.cookies && this.req.cookies.cookieId){
                cookieId = this.req.cookies.cookieId
            }else if (this.req.cookies && this.req.cookies.guId){
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
                if (item.guessLikeHouse.data.length > 0){
                    item.guessLikeHouse.data.forEach((itemI, index)=> {
                        item.guessLikeHouse.data[index]['url']="/"+cityInfo.data.cityPinyin+"/rent/"+itemI.encryptHouseId+".html?channel="+ channel || "";
                        item.guessLikeHouse.data[index]['bigDataParams']=this.generateBigDataParams({ eventName:'1202039',eventParam:{rent_house_id:itemI.houseId }, channel:channel || "", type: 2})
                    });
                }
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
           大数据埋点参数
           -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            item['DataParams'] ={
                // 点击搜索框
                searchD:this.generateBigDataParams({
                    eventName: '1202022',
                    channel:channel,
                    type: 2
                }),
                // 点击区域筛选
                areasD : this.generateBigDataParams({
                    eventName: '1202023',
                    channel:channel,
                    type: 2
                }),
                // 点击租金筛选
                rentPD : this.generateBigDataParams({
                    eventName: '1202024',
                    channel:channel,
                    type: 2
                }),
                // 点击租金-自定义-确定
                rentSelfPD : this.generateBigDataParams({
                    eventName: '1202025',
                    channel:channel,
                    type: 2
                }),
                //点击户型筛选
                typeD : this.generateBigDataParams({
                    eventName: '1202026',
                    channel:channel,
                    type: 2
                }),
                //点击户型-确定
                typeCoD : this.generateBigDataParams({
                    eventName: '1202027',
                    channel:channel,
                    type: 2
                }),
                //点击更多筛选
                moreD : this.generateBigDataParams({
                    eventName: '1202028',
                    channel:channel,
                    type: 2
                }),
                //点击更多-确定
                moreCoD : this.generateBigDataParams({
                    eventName: '1202029',
                    channel:channel,
                    type: 2
                }),
                //点击更多-重置
                moreRD : this.generateBigDataParams({
                    eventName: '1202030',
                    channel:channel,
                    type: 2
                }),
                //点击排序按钮
                sortD : this.generateBigDataParams({
                    eventName: '1202031',
                    channel:channel,
                    type: 2
                }),
                //点击排序-默认排序
                sortDefD : this.generateBigDataParams({
                    eventName: '1202032',
                    channel:channel,
                    type: 2
                }),
                //点击排序-租金从低到高
                sortltD : this.generateBigDataParams({
                    eventName: '1202033',
                    channel:channel,
                    type: 2
                }),
                //点击排序-租金从高到底
                sorttlD : this.generateBigDataParams({
                    eventName: '1202034',
                    channel:channel,
                    type: 2
                }),
                //点击排序-面积从大到小
                sortsqD : this.generateBigDataParams({
                    eventName: '1202035',
                    channel:channel,
                    type: 2
                }),
                //点击排序-面积从小到大
                sortSbD : this.generateBigDataParams({
                    eventName: '1202036',
                    channel:channel,
                    type: 2
                }),
                //点击排序-发布时间从近到远
                sortTimeD : this.generateBigDataParams({
                    eventName: '1202037',
                    channel:channel,
                    type: 2
                }),
                //筛选无结果点击清除条件按钮
                clearD : this.generateBigDataParams({
                    eventName: '1202038',
                    channel:channel,
                    type: 2
                }),
                //搜索历史清除
                clearHistoryD : this.generateBigDataParams({
                    eventName: '1203006',
                    channel:channel,
                    type: 2
                }),
            };
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            城市的定位名称获取
           -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            item['cityName'] = defultName || this.req.cookies.location_cityName || cityInfo.data.cityName;
            item['channel'] = channel ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            渲染模板
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            if (item.status == 1){
                Object.assign(this.templateData, {
                    "title" : meta.title ||"租房" ,
                    "keywords" : meta.keywords ||"租房",
                    "description" : meta.description ||"租房",
                    "matchStylesheetPath" : modulePathArray.join("/") ,
                    "controllerJavascriptPath" : modulePathArray.join("/"),
                    "item" : item ,
                    "rentBusinessSput":rentBusinessSpurt,

                }) ;
                this.render(modulePathArray.join("/")) ;
            }else {
                Object.assign(this.templateData, {
                    "title" :"租房" ,
                    "matchStylesheetPath" : errPathArray.join("/") ,
                    "controllerJavascriptPath" : errPathArray.join("/"),
                    "item" : item ,
                    "rentBusinessSput":rentBusinessSpurt
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