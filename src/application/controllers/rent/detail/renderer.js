/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> rent -> index -> renderer.js
3. 作者：tangxuyang@lifang.com
4. 备注：租房详情页面渲染器
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
        let modulePathArray = [ "rent" , "detail" ] ;   
        try {
            let houseId = this.req.params.houseId || "b5c3cf77006f3297" ;   //加密的houseId，b5c3cf77006f3297调试用
            let  channel =this.req.query['channel'] || "";
            let  agentId=this.req.query['agentId'] || "";
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            调用接口获取数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/  
            let adf = new ApiDataFilter(this.req.app) ; 
            let apiData = await adf.request({
                "apiPath" : modulePathArray.join(".") ,
                "data" : { "houseId" : houseId ,"agentId":agentId}
            }) ;        
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            处理返回数据供模板使用
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            //合并视频和图片
            let imgList = [];
            let item = apiData.data;
            if(item.houseVideos && item.houseVideos.videoUrl){
                imgList.push({
                    isVideo: true,
                    url: item.houseVideos.videoUrl,
                    imageUrl: item.houseVideos.imageUrl, 
                    videoPlayUrl : "/" + this.req.params.city + '/videoplay/index?src=' + encodeURIComponent(item.houseVideos.videoUrl)
                });
            }
            if(item.houseImages && item.houseImages.length > 0){
                for(let i = 0; i < item.houseImages.length; i++){
                    imgList.push({
                        url: item.houseImages[i]
                    });
                }
            }
            item.imgList = imgList;  

            //计算isExternal
            if(item.houseId > 1000000000){//大于1000000000是外部房源
                item.isExternal = true;
                item.payTypeStr = "面议"; //prd要求外来房源统一显示面议
            }    

            //相似房源跳转路径
            if(item.similarHouses && item.similarHouses.length > 0){            
                item.similarHouses.forEach(house => {                
                    house.url = "/" + this.req.params.city + '/rent/' + house.encryptHouseId + ".html" ;
                    house.bigDataParams = this.generateBigDataParams({                    
                        eventName: "1204012",
                        eventParam: {
                            rent_house_id: house.houseId
                        },
                        channel:channel,
                        type: 2
                    });
                });            
            }

            //小区跳转路径
            item.subEstateUrl = "/" + this.req.params.city + '/community/' + item.encryptSubEstateId + ".html" ;

            //经纪人跳转路径
            item.houseAgent.url = "/" + this.req.params.city + '/space/' + item.houseAgent.agentId + ".html" ;
            
            //地图跳转路径
            item.mapUrl = "";
            item.mapUrl = this.templateData.domain + '/esf/map.html?longitude=' + item.longitude + '&latitude=' + item.latitude + '&houseName=' + item.subEstateName + '&houseAddress=' + item.estateAddr;        

            //大数据埋点参数
            item.bigDataParams = {
                clickImageBigDataParams : this.generateBigDataParams({
                    eventName: "1204007",
                    eventParam: {
                        rent_house_id: item.houseId
                    },
                     channel:channel,
                    type: 2
                }), //点击上部图片埋点参数
                clickSubEstateBigDataParams : this.generateBigDataParams({
                    eventName: "1204008",
                    eventParam: {
                        estate_id: item.subEstateId
                    },
                     channel:channel,
                    type: 2
                }), //点击小区链接埋点参数
                clickSubEstateInfoBigDataParams : this.generateBigDataParams({
                    eventName: "1204009",
                    eventParam: {
                        estate_id: item.subEstateId
                    },
                     channel:channel,
                    type: 2
                }), //点击小区信息埋点参数
                clickMapBigDataParams : this.generateBigDataParams({
                    eventName: "1204011",
                    eventParam: {                
                    },
                     channel:channel,
                    type: 2
                }), //点击地图埋点参数
                avatarBigDataParams : this.generateBigDataParams({
                    eventName: "1204014",
                    eventParam: {
                        agent_id: item.houseAgent && item.houseAgent.agentId
                    },
                     channel:channel,
                    type: 2
                }), //点击底部经纪人头像埋点参数
                wxBigDataParams : this.generateBigDataParams({
                    eventName: "1204019",
                    eventParam: {
                        agent_id: item.houseAgent && item.houseAgent.agentId,
                        rent_house_id: item.houseId
                    },
                     channel:channel,
                    type: 2
                }),
                mobileBigDataParams : this.generateBigDataParams({
                    eventName: "1204015",
                    eventParam: {
                        agent_id: item.houseAgent && item.houseAgent.agentId,
                        rent_house_id: item.houseId
                    },
                     channel:channel,
                    type: 2
                }),//点击评论总数埋点
                clickCommentTotalBigDataParams: this.generateBigDataParams({
                    eventName: "1204022",
                    eventParam: {
                        house_id: item.houseId,
                        estate_id: item.subEstateId
                    },
                     channel:channel,
                    type: 2
                }),//我来评论埋点
                clickGoCommentBigDataParams: this.generateBigDataParams({
                    eventName: "1204023",
                    eventParam: {
                        house_id: item.houseId,
                        estate_id: item.subEstateId
                    },
                    channel:channel,
                    type: 2
                }),
                downloadBigDataParams : this.generateBigDataParams({ eventName: "1204024" ,channel:channel})
            };
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            租房标题和城市名称存起来，后面用
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let houseTitle = apiData.data.houseTitle ;
            let subEstateName = apiData.data.subEstateName ;
            let cityName = apiData.data.cityName ;
            if(cityName && cityName.charAt(cityName.length - 1) === "市") {
                cityName = cityName.substring( 0 , cityName.length - 1) ;
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/            
            Object.assign(this.templateData, { 
                "title" : houseTitle + "_" + cityName + subEstateName + "租房-悟空找房" , 
                "keywords" : houseTitle + "，" + subEstateName + "租房，真实房屋出租" ,
                "description" : "悟空找房网为您提供" + subEstateName + "租房信息，整租合租" + cityName + subEstateName + "的房屋就上悟空找房网站，百分百真实房源。" ,
                "wechatTitle" : apiData.data.weChatShare.title ,
                "wechatContent" : apiData.data.weChatShare.content ,
                "wechatImgUrl" : apiData.data.weChatShare.picUrl ,
                "item" : item ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/") ,
                "cityName" : cityName  //download-app里面有这样一个变量
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