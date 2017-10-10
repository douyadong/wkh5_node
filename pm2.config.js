let namePrefix = "wkh5_";
module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name : namePrefix + "dev" ,
      script : "bin/www" ,
      env : {
        STAGE_ENV : "dev" ,
        PORT : 9019
      } ,
      watch : true ,
      cwd : "." ,
      instances : "1" ,
      exec_mode : "cluster"
    } ,
    {
      name : namePrefix + "test" ,
      script : "bin/www" ,
      env : {
        STAGE_ENV : "test" ,
        PORT : 9020
      },
      cwd : "." ,
      instances : "max" ,
      exec_mode : "cluster"
    } ,
    {
      name : namePrefix + "sim" ,
      script : "bin/www",
      env : {
        STAGE_ENV : "sim" ,
        PORT : 9019
      } ,
      cwd : "." ,
      instances : "max" ,
      exec_mode : "cluster"
    } ,
    {
      name : namePrefix + "prod" ,
      script : "bin/www" ,
      env : {
        STAGE_ENV : "prod" ,
        PORT : 9019
      } ,
      cwd : "." ,
      instances : "max" ,
      exec_mode : "cluster"
    }
  ]
}
