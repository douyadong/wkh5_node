/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：ares
2. 文件名：src -> configs -> redis.js
3. 作者：zhaohuagang@lifang.com
4. 备注：redis使用配置
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
export default {
    "dev": [
        {
            "host": "10.0.18.245",
            "password": "",
            "port": 7000,
            "ddl": 3600
        },
        {
            "host": "10.0.18.245",
            "password": "",
            "port": 7001,
            "ddl": 3600
        },
        {
            "host": "10.0.18.245",
            "password": "",
            "port": 7002,
            "ddl": 3600
        }
    ],
    "test": [
        {
            "host": "10.0.18.242",
            "password": "",
            "port": 7000,
            "ddl": 3600
        },
        {
            "host": "10.0.18.243",
            "password": "",
            "port": 7000,
            "ddl": 3600
        },
        {
            "host": "10.0.18.244",
            "password": "",
            "port": 7000,
            "ddl": 3600
        },
        {
            "host": "10.0.18.247",
            "password": "",
            "port": 7000,
            "ddl": 3600
        }
    ],
    "sim": [{
                "host":"redis1",
                "password":"",
                "port":7000,
                "ddl":3600
            },
            {
                "host": "redis1",
                "password": "",
                "port": 7001,
                "ddl": 3600
            },
            {
                "host": "redis2",
                "password": "",
                "port": 7000,
                "ddl": 3600
            },
            {
                "host": "redis2",
                "password": "",
                "port": 7001,
                "ddl": 3600
            },
            {
                "host": "redis3",
                "password": "",
                "port": 7000,
                "ddl": 3600
            },
            {
                "host": "redis3",
                "password": "",
                "port": 7001,
                "ddl": 3600
            }
    ],
    "prod": [
        {
            "host": "redis1",
            "password": "",
            "port": 7000,
            "ddl": 3600
        },
        {
            "host": "redis2",
            "password": "",
            "port": 7000,
            "ddl": 3600
        },
        {
            "host": "redis3",
            "password": "",
            "port": 7000,
            "ddl": 3600
        },
        {
            "host": "redis4",
            "password": "",
            "port": 7000,
            "ddl": 3600
        },
        {
            "host": "redis5",
            "password": "",
            "port": 7000,
            "ddl": 3600
        },
        {
            "host": "redis6",
            "password": "",
            "port": 7000,
            "ddl": 3600
        }
    ]
}