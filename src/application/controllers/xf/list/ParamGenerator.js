
// 查询条件生成器
class ParamGenerator {
    constructor(funcs) {
        this.funcs = Object.assign({}, ParamGenerator.DEFAULT, funcs);
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

ParamGenerator.createMappingFunc = function(type, fieldName){
    if(type == 1){// 单数
        return function(ret, data){
            ret[fieldName] = data;
        };
    }else{//数组
        return function(ret, data){
            if (data.constructor == Array) {
                ret[fieldName] = data;
            } else {
                ret[fieldName] = [data];                     
            }
        };
    }    
};

ParamGenerator.DEFAULT = {
    "di": ParamGenerator.createMappingFunc(1, "districtId"),// 区域id
    "to": ParamGenerator.createMappingFunc(1, "townId"),// 板块id
    "li": ParamGenerator.createMappingFunc(1, "subwayLineId"),// 地铁id
    "st": ParamGenerator.createMappingFunc(1, "subwayStationId"),// 地铁站id
    "id": ParamGenerator.createMappingFunc(1, "subEstateId"),// subestate

    "sdi": ParamGenerator.createMappingFunc(1, "districtId"),// 区域id
    "sto": ParamGenerator.createMappingFunc(1, "townId"),// 板块id
    "sli": ParamGenerator.createMappingFunc(1, "subwayLineId"),// 地铁id
    "sst": ParamGenerator.createMappingFunc(1, "subwayStationId"),// 地铁站id
    "sid": ParamGenerator.createMappingFunc(1, "subEstateId"),// subestate    

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
                max: 100000000
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
                max: 100000000
            },

            // 租房
        };

        var tmp = arr[data];

        if(tmp){
            ret.minPrice = tmp.min;
            ret.maxPrice = tmp.max ;
        }
    },
    "la": ParamGenerator.createMappingFunc(2, "bedroomType"),// 房型 1-一室 2-二室 3-三室 4-四室 5-五室及以上

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
                data.fullTwo = 1;
            },
            "s": function(data){// 近学校，二手房
                data.schoolHouse = 1;
            },
            "ns": function(data){// 南北通透，二手房
                data.northSouth = 1;
            }
        }

        if(data.constructor != Array){
            data = [data];
        }
        data.forEach(function(tag){
            let tagFunc = tagFuncs[tag];
            tagFunc(ret);                    
        });
    },
    "ty": ParamGenerator.createMappingFunc(2, "propertyType"),// 物业类型
    "ht": ParamGenerator.createMappingFunc(2, "houseType"),// 房屋类型
    "dt": ParamGenerator.createMappingFunc(2, "decorationType"),// 装修类型 新房 1：毛坯，2：精装，3：豪装 二手房 1: 毛坯 2:简装 3:中装 4: 精装 5: 豪装
    "so": ParamGenerator.createMappingFunc(1, "orderBy"),// 排序 1：均价从低到高，2：均价从高到低，3：面积从小到大，4：面积从大到小

    "pa": function(ret, data){
        // 此处供列表页使用，代表依次性加载多少页的数据
        ret.offset = 0;
        ret.pageSize = data * 10;
    },
    "ag": ParamGenerator.createMappingFunc(2, "houseAgeType"),// 房龄
    "m": ParamGenerator.createMappingFunc(1, "endMetres"),// 附近米数
    "lon": ParamGenerator.createMappingFunc(1, "localLon"),// 经度
    "lat": ParamGenerator.createMappingFunc(1, "localLat"),// 纬度
    "ar": ParamGenerator.createMappingFunc(1, "multipleSpace"),// 面积，二手房用
    
    
};

// 数组字段会有[]，移除它
ParamGenerator.normalize = function(obj){
    var ret = Object.assign({}, obj);
    var keys = Object.keys(ret);
    for(var i = 0; i < keys.length; i++){
        let key = keys[i];
        if(key.endsWith('[]')){
            if(ret[key].constructor != Array){
                ret[key.replace('[]','')] = [ret[key]];
            }else{
                ret[key.replace('[]','')] = ret[key];
            }            
            delete ret[key];
        }
    }

    return ret;
};


export default ParamGenerator;