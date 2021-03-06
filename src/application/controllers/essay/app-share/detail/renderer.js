/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：wkh5
2. 文件名：src -> application -> controllers -> article -> app-share -> detail -> renderer.js
3. 作者：tangxuyang@lifang.com
4. 备注：取经文章分享页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../../renderer" ;
import ApiDataFilter from "../../../../../system/libraries/apiDataFilter" ;
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
        let modulePathArray = [ "essay" , "app-share" ] ;
        try {
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            载入ApiDataFilter工具
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let adf = new ApiDataFilter(this.req.app) ;                       
            let articleId = this.req.params.articleId;
            let cityId = this.req.params.cityId||43;
            let data = await adf.request({
                "apiPath" : "article.detail" ,
                "data" : {
                    articleId: articleId,
                    cityId: cityId
                },
                "method":"get",
                "contentType":"application/json"
            }) ;
            data.data.articleDetailModel.articleId = articleId;

            if(data.data.articleDetailModel.contentType == 1){// 跳转
                this.res.redirect(data.data.articleDetailModel.content);
            }
            if(data.data.agentModel){
                data.data.agentModel.url = "/shanghai/space/" + data.data.agentModel.agentId + ".html";
            }            
            if(data.data.recommendArticleList){
                data.data.recommendArticleList.forEach(function(ele){
                    ele.bigDataParam = encodeURIComponent('{"eventName": "1022008"}');
                });
            }
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据            
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title" : data.data.articleDetailModel.title ,
                "keywords" : "" ,
                "description" : "" ,
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/"),
                "item": data.data,
                "cityId": cityId,
                "bigDataParams": {
                    zan: encodeURIComponent('{"eventName": "1022003", "eventParam": { "article_id": "'+articleId+'"}}'),  
                    comment: encodeURIComponent('{"eventName": "1022002", "eventParam": {"article_id": "'+articleId+'"}}'),  
                    phone: encodeURIComponent('{"eventName":"1022007", "eventParam": { "article_id": "'+articleId+'" }}')                
                }
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