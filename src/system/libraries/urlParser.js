/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> system -> libraries ->  urlParser.js
3. 作者：zhaohuagang@lifang.com
4. 备注：系统核心 - > url解析器
                @使用url包，具体使用方法参照：https://www.npmjs.com/package/url
                @url规则：http://user:pass@host.com:8080/p/a/t/h?query=string#hash
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import url from "url" ;
/*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
创建url解析器类
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
class UrlParser {
    constructor(urlString) {
        this.urlObj = url.parse(urlString, true) ;        
        this.pathSeparator = "/" ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取路径段值，
    @index指哪一段，从0开始
    /p/a/t/h 中药取得p就是getSection(0)，要取得a就是getSection(1)
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
     getSection(index) {
        let pathNameArray = new Array  ;
        let pathname = this.urlObj.pathname ;        
        if(pathname && pathname.length > 1) {
            pathname = pathname.substring(1, pathname.length) ;  
            if( ! pathname) return null ;          
            pathNameArray = pathname.split(this.pathSeparator) ;
        }        
        return (pathNameArray.length > index) ? pathNameArray[index] : null ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取路由模块+控制器名称，格式：account/login
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    getMCCombined() {
        return this.getSection(1) + this.pathSeparator + this.getSection(2) ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取queryString串
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    getQueryObject() {
        return this.urlObj.query ;
    }
    /*++-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取并解析路由中(:condition)部分成一个Object
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
    parseCondition({ condition , separator = "-" }) {
        let result = {} ;
        if( ! condition) return result ;
        let partArray = condition.split(separator) ;
        if( partArray.length === 1 ) return partArray[0] ;       
        partArray.forEach(( part , index )=>{
            let val = (partArray.length < index + 2) ? "" : partArray[index+1] ;
            if( index % 2 == 0 ) {
                if( ! result.hasOwnProperty(part)) result[part] = val ;
                else {                    
                    if( result[part].constructor != Array) result[part] = [result[part]] ;
                    result[part].push(val) ;
                }
            }
        }) ;
        return result ;
    }
    
}

export default UrlParser ;