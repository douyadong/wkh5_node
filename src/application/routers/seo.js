/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> routers -> seo.js
3. 作者：zhaohuagang@lifang.com
4. 备注：wkh5 -> dubbo接口连接demo模块路由器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载相关资源
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import express from "express" ;
import SeoErrorRenderer from "../controllers/seo/error/renderer" ;
let router = express.Router() ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/seo/error.html的路由规则
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/seo/error.html", function( req , res , next ) {      
    new SeoErrorRenderer(req, res, next) ;  
}) ;

export default router ;