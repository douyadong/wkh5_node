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
/*import ApiDataFilter from "../../../../system/libraries/apiDataFilter" ;*/
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
        try {

            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            扩展模板常规数据
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            Object.assign(this.templateData, {
                "title": "二手房-",
                "keywords": "二手房房源出售买卖",
                "description": "二手房就上悟空找房网，百分百真实房源。",
                "matchStylesheetPath": modulePathArray.join("/"),
                "controllerJavascriptPath": modulePathArray.join("/"),
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
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;