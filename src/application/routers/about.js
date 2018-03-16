/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：悟空找房h5
2. 文件名：src -> application -> routers -> about.js
3. 作者：tangxuyang@lifang.com
4. 备注：关于我们
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载相关资源
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import express from "express" ;
import VideoPlayRenderer from "../controllers/about/renderer" ;
let router = express.Router() ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/rent/detail的路由规则
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
router.get("/about.html", function(req, res, next) {   
    new VideoPlayRenderer(req, res, next) ;
}) ;
export default router ;
