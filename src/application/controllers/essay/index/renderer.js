/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> essay -> index -> renderer.js
3. 作者：zhaohuagang@lifang.com
4. 备注：取经频道首页页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../renderer" ;
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
        let modulePathArray = [ "essay" , "index" ] ;   
        try {
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            加载mock数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let apiData = require("../../../mock/essay/index")["default"].data ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            整理出有二级类别的文章类别            
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            let hasChildCategoryList = [] ;
            apiData.categoryList.forEach(( category , index ) => {
                let firstSubTitleList = category.firstSubTitleList ;
                if( firstSubTitleList && firstSubTitleList !== undefined && firstSubTitleList.length > 0 ) hasChildCategoryList.push(category) ;
            }) ;
            apiData.hasChildCategoryList = hasChildCategoryList ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------                     
            特别栏目数据处理
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            apiData.specailCategory.categoryUrl = "/" + this.req.params.city + "/essay/ca-" + apiData.specailCategory.categoryId ;
            apiData.specailCategory.cardList.forEach(( card , index ) => {
                card.url = "/" + this.req.params.city + "/essay/" + card.articleId + ".html"  ;
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------                     
            文章数据处理
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            apiData.articleList.forEach(( article , index ) => {
                article.url = "/" + this.req.params.city + "/essay/" + article.articleId + ".html"  ;
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
           加入到templateData中
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData , apiData) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData , { 
                "title" : "" , 
                "keywords" : "" ,
                "description" : "" ,
                "wechatTitle" : "" ,
                "wechatContent" : "" ,
                "wechatImgUrl" : "" ,                
                "matchStylesheetPath" : modulePathArray.join("/") ,
                "controllerJavascriptPath" : modulePathArray.join("/")
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