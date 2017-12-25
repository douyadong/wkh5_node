/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> esf -> detail -> renderer.js
3. 作者：zhaohuagang@lifang.com
4. 备注：二手房详情页面渲染器
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
        渲染模板
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/       
        this.renders() ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    渲染页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    async renders() {
        let modulePathArray = [ "esf" , "detail" ] ;
        try {
            let adf = new ApiDataFilter(this.req.app) ;   
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            获取houseId
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/ 
            let houseId = this.req.params.houseId || "" ;
            // 获取city
             let city = this.req.params.city || "" ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
               let apiData = await adf.request({
                   "apiPath" : modulePathArray.join("."),
                   "data" : { "houseId" : houseId }
               }) ;
             let item = apiData.data;
            // 地图跳转路径
            item['mapUrl'] = this.templateData.domain + '/esf/map.html?longitude=' + item.longitude + '&latitude=' + item.latitude + '&houseName=' + item.subEstateName + '&houseAddress=' + item.estateAddr;
            // 经纪人路径跳转URL
            item.houseAgent['url'] = this.templateData.domain +'/agent/agentDetail.html?agentId='+item.houseAgent.agentId;
            // 相似房源更多的Url
            item['similarHousesUrl'] = this.templateData.domain +'/esf/similarList.html?enCryptHouseId='+item.encryptHouseId;
            // 额外的脚本样式
            let  extraJavascript = [this.templateData.utilStaticPrefix+'/wkzf/js/util/echarts/echarts.js'];
            // 相册的视频和图片的数据的组装处理
            let imgList = [];
            if(item.houseVideos){
                item.houseVideos['isVideo'] = true ;
                item.houseVideos['url'] = item.houseVideos.videoUrl;
                item.houseVideos['videoPlayUrl'] = "/" + city + '/videoplay/index?src=' + encodeURIComponent(item.houseVideos.videoUrl);
                imgList.push(item.houseVideos)
            }
            if (item.houseImages){
                item.houseImages.forEach(function (eachItem) {
                    imgList.push({
                        isVideo:false,
                        url:eachItem
                    })
                })
            }
            item['imgList'] = imgList ;
            // 给相似房源添加埋点和点击调往页面的Url
            if (item.similarHouses){
                let that = this;
                item['similarFiveHouses'] = [];
                item.similarHouses.forEach((eachItem,index) =>{
                    if (index < 5){
                        item['similarFiveHouses'].push(eachItem);
                        item['similarFiveHouses'][index]['bigDataParams']= this.generateBigDataParams({ eventName:'1067036',eventParam:{house_id:eachItem.houseId,boutique:'1'}});
                        item['similarFiveHouses'][index]['url'] = that.templateData.domain +'/'+city+'/esf/'+eachItem.encryptHouseId+'.html' ;
                    }
                });
            }
            // 大数据埋点参数
            item['DataParams'] = {
                mobileBigDataParams: this.generateBigDataParams({
                    eventName: '1067027',
                    eventParam: {house_id: item.houseId, boutique: '0'},
                    type: 2
                }),
                wxBigDataParams: this.generateBigDataParams({
                    eventName: '1067031',
                    eventParam: {house_id: item.houseId, agent_id: item.houseAgent.agentId, boutique: '0'},
                    type: 2
                }),
                // 相册点击埋点
                albumBigDataParams: this.generateBigDataParams({
                    eventName: '1067037',
                    eventParam:{house_id: item.houseId},
                    type: 2
                }),
                 // 计算器
                calculatorBigDataParams : this.generateBigDataParams({
                    eventName: '1067038',
                    eventParam: {house_id: item.houseId, boutique: '0'},
                    type: 2
                }),
                // 小区
                communtBigDataParams: this.generateBigDataParams({
                    eventName: '1067033',
                    type: 2
                }),
                // 在售房源
                onSellBigDataParams: this.generateBigDataParams({
                    eventName:'1067034',
                    type: 2
                }),
                // 成交历史
                historyBigDataParams: this.generateBigDataParams({
                    eventName:'1067025',
                    eventParam:{house_id: item.houseId,history_sell_suits: item.historicalTransactionAmount},
                    type: 2
                }),
                // 点评
                commentBigDataParams: this.generateBigDataParams({
                    eventName:'1067040',
                    type: 2
                }),
                // 位置及周边
                mapBigDataParams: this.generateBigDataParams({
                    eventName:'1067032',
                    type: 2
                }),
                // 相似房源查看更多
                similarBigDataParams: this.generateBigDataParams({
                    eventName:'1067035',
                    type: 2
                }),

            };

            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" :"二手房详情" ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/"),
                "extraJavascripts" : extraJavascript ,
                "item" : item ,
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
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;