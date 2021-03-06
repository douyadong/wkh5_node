/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> routers -> community.js
3. 作者：tangxuyang@lifang.com
4. 备注：wkh5 -> 小区模块路由器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载相关资源
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import express from "express" ;
import CommunityDetailRenderer from "../controllers/community/detail/renderer" ;
import CommunityDetailChartApiProvider from "../controllers/community/detail/chartApiProvider" ;
import esfHouseListRenderer from "../controllers/community/same/renderer";
let router = express.Router() ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/community/的路由规则
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/community/(:subEstateId).html", function(req, res, next) {
    new CommunityDetailRenderer(req, res, next) ;  
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/api/town/detail/chart 的路由规则
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/api/community/detail/chart", function(req, res, next) {
    new CommunityDetailChartApiProvider(req, res, next) ;  
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/new/houseList/(:regionId)的路由规则 小区ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/community/houseList/(:regionId)", function(req, res, next) {
    new esfHouseListRenderer(req, res, next) ;
}) ;

export default router ;
