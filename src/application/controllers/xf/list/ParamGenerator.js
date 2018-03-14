
// 查询条件生成器
class ParamGenerator {
    constructor(funcs) {
        this.funcs = funcs || ParamGenerator.DEFAULT;
    }

    getParamObj(conditionObj, initObj) {
        let ret = Object.assign({},initObj);
        if (conditionObj) {
            for(var key in conditionObj){
                let func = this.funcs[key];
                if(func){
                    func(ret, conditionObj[key]);
                }
            }       
        }

        return ret;
    }
}

ParamGenerator.DEFAULT = {
    "di": function(ret, data){// 区域id
        ret.districtId = data;
    },

    "to": function(ret, data){// 板块id
        ret.townId = data;
    },

    "li": function(ret, data){// 地铁id
        ret.subwayLineId = data;
    },

    "st": function(ret, data){// 地铁站id
        ret.subwayStationId = data;
    },

    "cp": function(ret, data){// 价格 xxtoxx
        let cpArray = data.split("to");
        ret.minPrice= cpArray[0];
        ret.naxPrice= cpArray[1];
    },

    "la": function(ret, data){ // 房型 1-一室 2-二室 3-三室 4-四室 5-五室及以上
        if (  data.constructor == Array) {
            ret.bedroomType = data;
        } else {
            ret.bedroomType = [data];                     
        }
    },

    "ta": function(ret, data){// 标签
        var tagFuncs = {
            "f1": function(data){// 近地铁
                data.subwayHouse = 1;
            },
            "s1": function(data){// 即将开盘
                data.opening = 1;
            },
            "s2": function(data){// 在售楼盘
                data.saleBuilding = 1;
            },
            "f0": function(data){// 有优惠
                data.discounts = 1;
            },
            "f2": function(data){// 有视频
                data.hasVedio = 1;// 单词写对咋那么难呀
            }
        }

        data.forEach(function(tag){
            let tagFunc = tagFuncs[tag];
            tagFunc(ret);                    
        });
    },

    "ty": function(ret, data){// 物业类型
        if (data.constructor == Array){
            ret.propertyType = data;
        }else {
            ret.propertyType = [data];
        }
    },

    "dt": function(ret, data){// 装修类型 1：毛坯，2：精装，3：豪装
        if (data.constructor == Array){
            ret.decorationType = data;
        }else {
            ret.decorationType = [data];
        }
    },

    "so": function(ret, data){// 排序 1：均价从低到高，2：均价从高到低，3：面积从小到大，4：面积从大到小
        ret.orderBy = data;
    },

    "pa": function(ret, data){
        ret.offset = (+data - 1) * 10; // 页大小定位10，pa从1开始
    },
        
};


export default ParamGenerator;