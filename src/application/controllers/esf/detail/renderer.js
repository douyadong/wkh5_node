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
            获取houseId 获取city
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/ 
             let houseId = this.req.params.houseId || "" ;
             let city = this.req.params.city || "" ;
             let channel =  this.req.query['channel'] || "";
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板api数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
               let apiData = await adf.request({
                   "apiPath" : modulePathArray.join("."),
                   "data" : { "houseId" : houseId }
               }) ;
             let item = apiData.data;
             let  agentid =  "0";
            // 地图跳转路径
            item['mapUrl'] = this.templateData.domain + '/esf/map.html?longitude=' + item.longitude + '&latitude=' + item.latitude + '&houseName=' + item.subEstateName + '&houseAddress=' + item.estateAddr;
            // 经纪人路径跳转URL
            if(item.houseAgent){
                item.houseAgent['url'] = this.templateData.domain +'/'+city+"/space/"+item.houseAgent.agentId+".html";
                agentid = item.houseAgent.agentId;
            }
            // 相似房源更多的Url
            item['similarHousesUrl'] = this.templateData.domain +'/esf/similarList.html?enCryptHouseId='+item.encryptHouseId;
            // 额外的脚本样式
            let  extraJavascript = [this.templateData.utilStaticPrefix+'/wkzf/js/util/echarts/echarts.js'];
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            相册的视频和图片的数据的组装处理
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
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
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
             给相似房源添加埋点和点击调往页面的Url
             -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            if (item.similarHouses){
                let that = this;
                item['similarFiveHouses'] = [];
                item.similarHouses.forEach((eachItem,index) =>{
                    if (index < 5){
                        item['similarFiveHouses'].push(eachItem);
                        item['similarFiveHouses'][index]['bigDataParams']= this.generateBigDataParams({ eventName:'1067036',eventParam:{house_id:eachItem.houseId }});
                        item['similarFiveHouses'][index]['url'] = that.templateData.domain +'/'+city+'/esf/'+eachItem.encryptHouseId+'.html' ;
                    }
                });
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
             大数据埋点参数
             -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            item['DataParams'] = {
                // 手机点击埋点
                mobileBigDataParams: this.generateBigDataParams({
                    eventName: '1067027',
                    eventParam: {house_id: item.houseId,agent_id: agentid, boutique: item.isTopHouse},
                    channel:channel,
                    type: 2
                }),
                // 微信埋点
                wxBigDataParams: this.generateBigDataParams({
                    eventName: '1067086',
                    eventParam: {house_id: item.houseId, agent_id: agentid, boutique: item.isTopHouse},
                    channel:channel,
                    type: 2
                }),
                // 经纪人头像点击
                avatarBigDataParams: this.generateBigDataParams({
                    eventName: '1067043',
                    eventParam:{house_id: item.houseId ,agent_id: agentid, boutique: item.isTopHouse },
                    channel:channel,
                    type: 2
                }),
                // 相册点击埋点
                albumBigDataParams: this.generateBigDataParams({
                    eventName: '1067008',
                    eventParam:{house_id: item.houseId},
                    channel:channel,
                    type: 2
                }),
                 // 计算器
                calculatorBigDataParams : this.generateBigDataParams({
                    eventName: '1067038',
                    eventParam: {house_id: item.houseId, boutique: item.isTopHouse},
                    channel:channel,
                    type: 2
                }),
                // 小区名称埋点
                communtNameBigDataParams: this.generateBigDataParams({
                    eventName: '1067006',
                    eventParam: {house_id: item.houseId, estate_id: item.subEstateId},
                    channel:channel,
                    type: 2
                }),
                // 小区信息埋点
                communtBigDataParams: this.generateBigDataParams({
                    eventName: '1067033',
                    eventParam: {house_id: item.houseId, estate_id: item.subEstateId},
                    channel:channel,
                    type: 2
                }),
                // 在售房源
                onSellBigDataParams: this.generateBigDataParams({
                    eventName:'1067034',
                    eventParam: {house_id: item.houseId},
                    channel:channel,
                    type: 2
                }),
                // 成交历史
                historyBigDataParams: this.generateBigDataParams({
                    eventName:'1067025',
                    eventParam:{house_id: item.houseId},
                    channel:channel,
                    type: 2
                }),
                // 点评查看
                commentBigDataParams: this.generateBigDataParams({
                    eventName:'1067040',
                    eventParam:{house_id: item.houseId },
                    channel:channel,
                    type: 2
                }),
                // 点击去评论
                goCommentBigDataParams: this.generateBigDataParams({
                    eventName:'1067013',
                    eventParam:{house_id: item.houseId  , estate_id: item.subEstateId},
                    channel:channel,
                    type: 2
                }),
                // 位置及周边
                mapBigDataParams: this.generateBigDataParams({
                    eventName:'1067087',
                    eventParam:{house_id: item.houseId , boutique: item.isTopHouse},
                    channel:channel,
                    type: 2
                }),
                // 相似房源查看更多
                similarBigDataParams: this.generateBigDataParams({
                    eventName:'1067045',
                    eventParam:{house_id: item.houseId },
                    channel:channel,
                    type: 2
                }),
                // 基本信息查看更多
                basecInfoBigDataParams:this.generateBigDataParams({
                    eventName:'1067046',
                    eventParam:{house_id: item.houseId },
                    channel:channel,
                    type: 2
                }),
                // 下载app
                appBigDataParams:this.generateBigDataParams({
                    eventName:'1067042',
                    channel:channel,
                    type: 2
                }),

            };
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            对城市的字段进行处理（去掉"市"字）
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let shortName = "上海" ;
             if (item.cityName.lastIndexOf("市") == item.cityName.length - 1) {
                 shortName = item.cityName.substr(0,item.cityName.length - 1) ;
             }
             else shortName = item.cityName ;             
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" :shortName+item.estateName+"二手房-"+item.houseTitle+"二手房房源出售买卖-悟空找房" ,
                "keywords" : item.houseTitle+item.estateName+"优质二手房，"+item.estateName+"二手房房源出售买卖" ,
                "description" : "悟空找房网为您提供"+shortName+item.estateName+item.houseTitle+"的二手房房源信息，买"+item.estateName+"二手房就上悟空找房网，百分百真实房源。" ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/"),
                "extraJavascripts" : extraJavascript ,
                "item" : item ,
                "cityName" : shortName ,  //download-app里面有一个变量叫cityName
                "cityPinyin" : this.req.params.city
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