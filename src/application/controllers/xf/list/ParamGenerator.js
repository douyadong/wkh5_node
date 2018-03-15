
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

    "cp": function(ret, data){// 价格 xxtoxx, 自定义
        let cpArray = data.split("to");
        ret.minPrice= cpArray[0];
        ret.maxPrice= cpArray[1];
    },

    "pr": function(ret, data) {
        
        var arr = {
            // 新房
            "1": {
                min: 0,
                max: 100
            },
            "2": {
                min: 100,
                max: 150
            },
            "3": {
                min: 150,
                max: 200
            },
            "4": {
                min: 200,
                max: 250
            },
            "5": {
                min: 250,
                max: 300
            },
            "6": {
                min: 300,
                max: 500
            },
            "7": {
                min: 500,
                max: 1000
            },
            "8": {
                min: 1000,
                max: 2000
            },
            "9": {
                min: 2000,
                max: 0
            },

            // 二手房
            "11": {
                min: 0,
                max: 100
            },
            "12": {
                min: 100,
                max: 150
            },
            "13": {
                min: 150,
                max: 200
            },
            "14": {
                min: 200,
                max: 250
            },
            "15": {
                min: 250,
                max: 300
            },
            "16": {
                min: 300,
                max: 500
            },
            "17": {
                min: 500,
                max: 1000
            },
            "18": {
                min: 1000,
                max: 2000
            },
            "19": {
                min: 2000,
                max: 0
            },

            // 租房
        };

        var tmp = arr[data];

        if(tmp){
            ret.minPrice = tmp.min;
            ret.maxPrice = tmp.max;
        }
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
            "f1": function(data){// 近地铁,新房二手房共用
                data.subwayHouse = 1;
            },
            "s1": function(data){// 即将开盘，新房
                data.opening = 1;
            },
            "s2": function(data){// 在售楼盘，新房
                data.saleBuilding = 1;
            },
            "f0": function(data){// 有优惠，新房
                data.discounts = 1;
            },
            "f2": function(data){// 有视频，新房二手房共用
                data.haveVedio = 1;// 单词写对咋那么难呀
            },
            "fd": function(data){// 降价，二手房
                data.fallDown = 1;
            },
            "n": function(data){// 新上，二手房
                data.newStore = 1;
            },
            "m5": function(data){// 满5，二手房
                data.fullFive = 1;
            },
            "m2": function(data){// 满2，二手房
                data.fullTwo;
            },
            "s": function(data){// 近学校，二手房
                data.schoolHouse = 1;
            },
            "ns": function(data){// 南北通透，二手房
                data.northSouth = 1;
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

    "ht": function(ret, data){// 房屋类型
        if(data.constructor == Array){
            ret.houseType = data;
        }else{
            ret.houseType = [data];
        }
    },

    "dt": function(ret, data){// 装修类型 新房 1：毛坯，2：精装，3：豪装 二手房 1: 毛坯 2:简装 3:中装 4: 精装 5: 豪装
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
  
    "ag": function(ret, data) {// 房龄
        if(data.constructor == Array){
            ret.houseAgeType = data;
        } else {
            ret.houseAgeType = [data];
        }
    },

    "m": function(ret, data){// 附近米数
        ret.endMetres = data;
    },

    "lon": function(ret, data) {// 经度
        ret.localLon = data;
    },

    "lat": function(ret, data){// 纬度
        ret.localLat = data;
    },

    "ar": function(ret, data){// 面积，二手房
        var arr = {
            "1": {
                min: 0,
                max: 50
            },
            "2": {
                min: 50,
                max: 70
            },
            "3": {
                min: 70,
                max: 90
            },
            "4": {
                min: 90,
                max: 110
            },
            "5": {
                min: 110,
                max: 130
            },
            "6": {
                min: 130,
                max: 150
            },
            "7": {
                min: 150,
                max: 200
            },
            "8": {
                min: 200,
                max: 300
            },
            "9": {
                min: 300,
                max: 0
            }
        }

        var tmp = arr[data];
        if(tmp){
            ret.minSpace = tmp.min;
            ret.maxSpace = tmp.max;
        }
    }
};

// 数组字段会有[]，移除它
ParamGenerator.normalize = function(obj){
    var ret = Object.assign({}, obj);
    var keys = Object.keys(ret);
    for(var i = 0; i < keys.length; i++){
        let key = keys[i];
        if(key.endsWith('[]')){
            ret[key.replace('[]','')] = ret[key];
            delete ret[key];
        }
    }

    return ret;
};

export default ParamGenerator;