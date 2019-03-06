
## 1. 超链接接口文档
### 1.1 功能描述
提供超链接的增删改查
### 1.2 请求说明
> 请求方式：   
> 1.增 （post） url：域名/superlink_blu/add_link   
> 2.删 （delete） url：域名/superlink_blu/del_link/(链接id)   
> 3.改 （put） url：域名/superlink_blu/update_link/(链接id)   
> 4.查 （get） url：域名/superlink_blu/list_link
### 1.3 请求参数
#### 1.3.1 增 （json）

字段       |字段类型     |字段说明
:---------:|:-----------:|:-----------:
link_name  |string       |链接名称
link_url   |string       |链接地址
#### 1.3.2 删 

>   地址上携带上id
#### 1.3.3 改 （json）
>   地址上携带id

字段       |字段类型     |字段说明
:---------:|:-----------:|:-----------:
link_name  |string       |链接名称
link_url   |string       |链接地址
#### 1.3.4 查 

>获取所有链接列表
### 1.4 返回结果
> 增、删、改 成功返回200    
> 以下是查询返回的参数示例

```json  
{
  "list_link": [
    {
      "link_name": "test02",
      "link_url": "12333388"
    },
    {
      "link_name": "test02",
      "link_url": "12333388"
    }
  ]
}
```

### 1.5 返回参数
> 增删 改 返回   

字段       |字段类型       |字段说明
------------|-----------|-----------
error_no       |string        |状态码
error_ms       |string        |错误信息


### 1.6 错误状态码
状态码       |说明
------------|:-----------:
200      |ok
400       |参数问题
503       |数据库问题