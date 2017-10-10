悟空找房h5站点node代码库

### 本地运行、调试
```
npm install
npm run watch
```
启动vs code调试

### visual studio code调试配置

```
//launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/bin/www",
            "stopOnEntry": false,
            "args": [],
            "cwd": "${workspaceRoot}",
            "preLaunchTask": null,
            "runtimeExecutable": null,
            "runtimeArgs": [
                "--nolazy"
            ],
            "env": {
                "STAGE_ENV": "dev",
                "PORT":9020                
            },
            "console": "internalConsole",
            "sourceMaps": true,
            "outFiles": [],
            "outDir": "${workspaceRoot}/dist"
        },
        {
            "name": "Attach",
            "type": "node",
            "request": "attach",
            "port": 5858,
            "address": "localhost",
            "restart": false,
            "sourceMaps": true,
            "outFiles": [],
            "localRoot": "${workspaceRoot}",
            "remoteRoot": null,
            "outDir": "${workspaceRoot}/dist"
        },
        {
            "name": "Attach to Process",
            "type": "node",
            "request": "attach",
            "processId": "${command.PickProcess}",
            "port": 5858,
            "sourceMaps": true,
            "outFiles": [],
            "outDir": "${workspaceRoot}/dist"
        }
    ]
}
```