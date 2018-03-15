/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：wkh5
2. 文件名：src -> application -> controllers -> xf -> list -> renderer.js
3. 作者：tangxuyang@lifang.com
4. 备注：新房列表页面渲染器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppRendererControllerBasic from "../../renderer" ;
import ApiDataFilter from "../../../../system/libraries/apiDataFilter" ;
import UrlParser from "../../../../system/libraries/urlParser" ;
import guID from "../../../../system/libraries/guId" ;
import ParamGenerator from "./ParamGenerator";
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
        let modulePathArray =  [ "xf" , "list" ] ; // 渲染的页面        
        try{    
            // 解析查询条件
            let adf = new ApiDataFilter(this.req.app) ;
            let urlParser = new UrlParser(this.req.originalUrl); // new一个url处理的对象
            
            let param ={
                cityId: 43/*cityId*/,
                pageSize: 10
            };

            let data = null;

            // 如果有查询条件，按照查询条件加载数据，否则不加载数据
            if(this.req.params.condition){
                console.log("condition:", this.req.params.condition);
                let conditionObj = urlParser.parseCondition({condition: this.req.params.condition});
                console.log("conditionObj:", conditionObj);
                param = this.generateParams(conditionObj, param);
                console.log("params:", param);
                data = await adf.request({
                    "apiPath" : modulePathArray.join("."),
                    "data" : param,
                    "method":"post",
                    "contentType":"application/json"
                }) ;
            }            

            Object.assign(this.templateData, {                 
                "matchStylesheetPath" : modulePathArray.join("/"),
                "controllerJavascriptPath" : modulePathArray.join("/"),
                "data": data
            }) ;      

            this.render(modulePathArray.join("/")) ;
        }catch (err){
            this.next(err)
        }
    }

    // 根据查询条件生成后端接口需要的查询参数
    generateParams(conditionObj, initObj) {

        return new ParamGenerator().getParamObj(conditionObj, initObj);
    }
}
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
最后将render暴露出去
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default Renderer ;