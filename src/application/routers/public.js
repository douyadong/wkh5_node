/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> routers -> public.js
3. 作者：zhaohuagang@lifang.com
4. 备注：wkh5 -> public模块路由器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载相关资源
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import express from "express" ;
import PublicCitySelectApiProvider from "../controllers/city/renderer" ;
let router = express.Router() ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/public/city/select 的路由规则，城市选择页面
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/public/city/select", function( req , res , next ) {
    new PublicCitySelectApiProvider(req, res, next) ;
}) ;

export default router ;