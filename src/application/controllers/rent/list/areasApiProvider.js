/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：wkh5_node
2. 文件名：src -> application -> controllers -> rent -> list -> areasApiProvider.js
3. 作者：liyang@lifang.com
4. 备注：城市区域异步接口
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
加载配置及工具
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import AppApiControllerBasic from "../../api" ;
import ApiDataFilter from "../../../../system/libraries/apiDataFilter" ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
创建一个apiProvider实例
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
class RestfulApi extends AppApiControllerBasic {
    constructor(req, res, next) {
        super(req, res, next) ;
        this.outputs() ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    输出数据
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    async outputs() {
        try {
            let adf = new ApiDataFilter(this.req.app) ;
            this.jsonObject = await adf.request({
                "apiPath" : "rent.list.cityAreas" ,
                "data" : this.req.query
            }) ;
            /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            输出内容
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
            this.output() ;
        }
        catch(ex){
            this.next(ex) ;
        }
        /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        结束
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    }
}

export default RestfulApi ;