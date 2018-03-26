/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> routers -> trend.js
3. 作者：liyang@lifang.com
4. 备注：wkh5 -> 价格行情模块路由器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载相关资源
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import express from "express" ;
import esfCityRenderer from "../controllers/trend/esf/city/renderer" ;
import esfDistrictRenderer from "../controllers/trend/esf/district/renderer" ;
import esfTownRenderer from "../controllers/trend/esf/town/renderer" ;
import esfCommunityRenderer from "../controllers/trend/esf/community/renderer" ;
import newCityRenderer from "../controllers/trend/new/city/renderer" ;
import newDistrictRenderer from "../controllers/trend/new/district/renderer" ;
import newTownRenderer from "../controllers/trend/new/town/renderer" ;
import newCommunityRenderer from "../controllers/trend/new/community/renderer" ;
import esfTownListRenderer from "../controllers/trend/esf/town-list/renderer" ;
import esfSoldHistoryRenderer from "../controllers/trend/esf/sold-history/renderer" ;
let router = express.Router() ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/esf的路由规则  城市ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/esf", function(req, res, next) {
    new esfCityRenderer(req, res, next) ;
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/esf/city/(:regionId)的路由规则 区域ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/esf/district/(:regionId)", function(req, res, next) {
    new esfDistrictRenderer(req, res, next) ;
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/esf/district/(:regionId)的路由规则 板块ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/esf/town/(:regionId)", function(req, res, next) {
    new esfTownRenderer(req, res, next) ;
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/esf/community/(:regionId)的路由规则 小区ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/esf/community/(:regionId)", function(req, res, next) {
    new esfCommunityRenderer(req, res, next) ;
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/new/city的路由规则  城市ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/new", function(req, res, next) {
    new newCityRenderer(req, res, next) ;
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/new/city/(:regionId)的路由规则 区域ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/new/district/(:regionId)", function(req, res, next) {
    new newDistrictRenderer(req, res, next) ;
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/new/district/(:regionId)的路由规则 板块ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/new/town/(:regionId)", function(req, res, next) {
    new newTownRenderer(req, res, next) ;
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/new/community/(:regionId)的路由规则 小区ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/new/community/(:regionId)", function(req, res, next) {
    new newCommunityRenderer(req, res, next) ;
}) ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/new/townList/(:regionId)的路由规则 城市ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/esf/townList/(:regionId)", function(req, res, next) {
    new esfTownListRenderer(req, res, next) ;
}) ;

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/:city/trend/new/soldHistory/(:regionId)的路由规则 小区ID
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/:city/trend/esf/soldHistory/(:regionId)", function(req, res, next) {
    new esfSoldHistoryRenderer(req, res, next) ;
}) ;
export default router ;