/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> application -> routers -> rent.js
3. 作者：tangxuyang@lifang.com
4. 备注：wkh5 -> 租房模块路由器
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载相关资源
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import express from "express" ;
import RentDetailRenderer from "../controllers/rent/detail/renderer" ;
let router = express.Router() ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/rent/detail的路由规则
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/detail/(:houseId).html", function(req, res, next) {   
    new RentDetailRenderer(req, res, next) ;  
}) ;
export default router ;
