# Mini-Chat by Mongodb + Express + Vue + Node + Webpack

## Build Setup (for Mac)
``` 打开终端

# 安装Mongodb
cd /usr/local   //进入 /usr/local
sudo curl -O https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.4.2.tgz  //下载
sudo tar -zxvf mongodb-osx-x86_64-3.4.2.tgz  //解压
sudo mv mongodb-osx-x86_64-3.4.2 mongodb  //重命名为 mongodb 目录
export PATH=/usr/local/mongodb/bin:$PATH  //把 MongoDB 的二进制命令文件目录（安装目录/bin）添加到 PATH 路径中

# 启动Mongodb
sudo mongod
(再打开一个终端)
$ cd /usr/local/mongodb/bin 
$ ./mongo

# 启动node server
cd 项目根路径/server
node receive.js

# 安装依赖
cd 项目根路径
npm install

# 打包
cd 项目根路径
webpack

# 本地运行
npm run dev
```
