/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> controllers -> renderer.js
3. 作者：zhaohuagang@lifang.com
4. 备注：renderer类型的controller应用基类，她继承于system/core/controllers/renderer.js
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import SystemRendererControllerBasic from "../../system/core/controllers/renderer" ;
import UrlParser from "../../system/libraries/urlParser" ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
创建一个渲染器实例
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
class AppRendererControllerBasic extends SystemRendererControllerBasic {
    constructor(req, res, next) {
        super(req, res, next) ;
        let appConf = this.req.app.locals.confs.app ;        
        let up = new UrlParser(req.originalUrl) ;
        let MCCombined = up.getMCCombined() ;
        Object.assign(this.templateData, {
            "appType" : appConf.appType ,
            "version" : appConf.version ,
            "title" : "" ,
            "keywords" : "" ,
            "description" : "" ,            
            "appStaticPrefix" : this.getStaticPrefix("app") ,
            "utilStaticPrefix" : this.getStaticPrefix("util") ,
            "extraStylesheets" : [] ,
            "matchStylesheet" : MCCombined ,
            "extraJavascripts" : [] ,
            "matchJavascript" : MCCombined ,
            "appName" : appConf.appName ,            
            "domain" : appConf.domain[this.req.app.locals.stage_env] ,
            "wechatTitle" : "" ,
            "wechatContent" : "" ,
            "wechatImgUrl" : ""
        }) ;
        this.pluginStatic = {
            "css" : {
                "wktable" : this.getStaticPrefix("util") + "/wkzf/js/util/jQuery.wktable/wktable.min.css" ,
                "daterangepicker" : this.getStaticPrefix("util") + "/wkzf/js/util/daterangepicker/daterangepicker.css" ,
                "select2" : this.getStaticPrefix("util") + "/wkzf/js/util/select2/4.0.1/dist/css/select2.min.css"
            } ,
            "js" : {
                "daterangepicker" : [
                    this.getStaticPrefix("util") + "/wkzf/js/util/daterangepicker/moment.js" ,
                    this.getStaticPrefix("util") + "/wkzf/js/util/daterangepicker/daterangepicker.js" 
                ] ,
                "select2" : [
                    this.getStaticPrefix("util") + "/wkzf/js/util/select2/4.0.1/dist/js/select2.min.js" ,
                    this.getStaticPrefix("util") + "/wkzf/js/util/select2/4.0.1/dist/js/i18n/zh-CN.js" ,
                    this.getStaticPrefix("util") + "/wkzf/js/cascadingSelect2.min.js"
                ]
            }
        }
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取静态资源路径前缀
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    getStaticPrefix(type) {
        let staticConf = this.req.app.locals.confs.static ;
        let stage_env = this.req.app.locals.stage_env ;
        return staticConf["prefix"][stage_env] + staticConf[type] ;
    }
}

export default AppRendererControllerBasic ;
