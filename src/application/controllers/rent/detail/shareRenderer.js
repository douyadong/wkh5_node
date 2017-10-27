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
        try{
        let houseId = this.req.params.houseId || "" ;   //加密的houseId
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        调用接口获取数据
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/  
        let adf = new ApiDataFilter(this.req.app) ; 
        let apiData = await adf.request({
            "apiPath" : "rent.detail" ,
            "data" : { "houseId" : houseId }
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
                videoPlayUrl: this.templateData.currentProjectDir + this.req.params.city + '/videoplay/index?src=' + item.houseVideos.videoUrl
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
                house.url = this.templateData.currentProjectDir + this.req.params.city + '/rent/share-detail/' + house.encryptHouseId;
                house.bigDataParams = this.generateBigDataParams({                    
                    eventName: "1204012",
                    eventParam: {
                        rent_house_id: house.houseId
                    },
                    type: 2
                });
            });            
        }

        //小区跳转路径
        item.subEstateUrl = this.templateData.currentProjectDir + this.req.params.city + '/estate/share-detail/' + item.encryptSubEstateId;

        //经纪人跳转路径
        item.houseAgent.url = this.templateData.currentProjectDir + this.req.params.city + '/space/share-index/' + item.houseAgent.agentId;
        
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
                type: 2
            }), //点击上部图片埋点参数
            clickSubEstateBigDataParams : this.generateBigDataParams({
                eventName: "1204008",
                eventParam: {
                    estate_id: item.subEstateId
                },
                type: 2
            }), //点击小区链接埋点参数
            clickSubEstateInfoBigDataParams : this.generateBigDataParams({
                eventName: "1204009",
                eventParam: {
                    estate_id: item.subEstateId
                },
                type: 2
            }), //点击小区信息埋点参数
            clickMapBigDataParams : this.generateBigDataParams({
                eventName: "1204011",
                eventParam: {                
                },
                type: 2
            }), //点击地图埋点参数
            avatarBigDataParams : this.generateBigDataParams({
                eventName: "1204014",
                eventParam: {
                    agent_id: item.houseAgent && item.houseAgent.agentId
                }, 
                type: 2
            }), //点击底部经纪人头像埋点参数
            wxBigDataParams : this.generateBigDataParams({
                eventName: "1204019",
                eventParam: {
                    agent_id: item.houseAgent && item.houseAgent.agentId,
                    rent_house_id: item.houseId
                }, 
                type: 2
            }),
            mobileBigDataParams : this.generateBigDataParams({
                eventName: "1204015",
                eventParam: {
                    agent_id: item.houseAgent && item.houseAgent.agentId,
                    rent_house_id: item.houseId
                },
                type: 2
            })
        };
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        扩展模板常规数据
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        Object.assign(this.templateData, { 
            "title" : apiData.data.houseTitle , 
            "wechatTitle" : apiData.data.weChatShare.title ,
            "wechatContent" : apiData.data.weChatShare.content ,
            "wechatImgUrl" : apiData.data.weChatShare.picUrl ,
            "item" : item
        }) ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        扩展模板数据
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
        Object.assign(this.templateData, { extraStylesheets : [ ] , "extraJavascripts" : [] }) ;
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        渲染模板
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/              
        this.render("rent/detail") ; 
        }catch(ex){
            this.next(ex);
        }
    }
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;