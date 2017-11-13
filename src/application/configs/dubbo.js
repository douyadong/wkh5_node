/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：wkh5_node
2. 文件名：src -> configs -> dubbo.js
3. 作者：zhaohuagang@lifang.com
4. 备注：zookeeper及dubbo连接配置
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default {
    application : {
        name : "wkh5_node"
    } ,  //给连接zookeeper设置的当前应用标识
    dubboVer : "2.5.3.6" ,     
    register : {
        dev : "10.0.18.52:2181,10.0.18.5:2181,10.0.18.54:2181" ,
        test : "10.0.18.175:2181" ,
        sim : "10.0.18.175:2181" ,
        prod : ""
    } ,
    dependencies : {
        AgentHouseService : {
            interface : "com.lifang.housesoa.facade.service.AgentHouseService" ,
            timeout : 6000 ,
            methodSignature : {
                serviceAgentHouses : ( agentId ) => [ { "$class" : "int", "$" : agentId } ]
            }
        }
    }
} ;