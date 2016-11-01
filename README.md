# lothar

![](https://img.shields.io/npm/v/lothar.svg) ![](https://img.shields.io/npm/dm/lothar.svg)


lothar是基于[blade](http://www.golaravel.com/laravel/docs/5.1/blade/)模板引擎开发的[feather2](https://github.com/feather-team/feather2)的定制版工程框架

## 使用

#### 如果在此之前没有学习过feather2，请移步先学习[feather2](https://github.com/feather-team/feather2)，如若已学习，可进入接下来的lothar使用文档

#### 如果是1.x项目，可直接通过[feather2lothar](https://github.com/jsyczhanghao/feather2lothar)工具进行转换

### 安装

```sh
npm install -g lothar
```

lothar和feather2的使用上基本上没有太大不同，feather2是基于单模块项目，而lothar是基于多模块，我们可以使用init命令初始化一个项目


```sh
lothar init demo #创建项目demo
```

创建完成后，可进入demo目录查看目录结构，会有common和main2个目录，这两个目录则为2个项目模块，lothar中规定，必须至少拥有一个项目模块common

### 项目模块是什么？

项目模块是指功能及开发相对独立的业务模块，拿一个电商网站举例：

一个完整的电商网站拥有很多频道，如：首页、商品、活动、用户、海外等频道，假设，这些频道都是pc端的业务，有没有发现，实际上他们之间的联系非常少，除了：公用头尾、侧边栏、导航等，另外一些通用的技术架构、js公用类库、ui库等

其他地方基本上不存在任何联系，业务与业务之间的连接也仅仅通过链接方式进行跳转。他们之间的公用部分的改动频率也是非常低的，那么:

1.  是否有必要将非本频道的代码都集中存放在一个仓库或者一个目录中
1.  是否有必要将非本频道的代码每次都纳入至lothar中进行编译
1.  频道开发时，是否有必要互相关注其他频道的代码
1.  每个频道代码的权限控制

所以lothar推出项目模块的概念，在lothar中进行项目模块的区分，有助于 

1.  提高开发效率，本业务的开发不需额外关注其他业务任何事情 
2.  有利于模块间的解耦，后期可独立上线，模块间仅通过map.json进行静态资源的关联。
3.  利于权限控制


####也可通过命令行--module 参数进行模块的创建:
 
 ```sh
 lothar init demo/news --module #创建demo项目的新闻模块
 ```

### start

对common和main模块进行编译

```sh
lothar release -r demo/common
lothar release -r demo/main
```

启动server， 因为lothar是基于blade的，blade为php模板引擎，所以需要本地需要支持php及php-cgi，用户可自行百度查看各平台下php的安装， lothar所需的php版本 >= 5.4

```sh
lothar server start
```

打开浏览器，刷新页面，查看效果

### 注意点

因为lothar的使用和feather2基本一致，下面会列出需要注意的几点：

* lothar中访问页面时，url的前缀需要为模块名，比如访问common模块下的 index.html，则正确的访问url为 common/index.html

    #### 注：包括js中一些访问的本地数据源做同样的数据，所以lothar不建议直接异步请求本地数据源的原地址，而是采用rewrite.js进行转发，因为rewrite.js中的本地原地址lothar会自动进行模块名的添加，如common模块下的rewrite.js文件：

    ```js
    module.exports = {
        '/ajax/test': '/data/async/test.json' 
    };
    ```

    编译后访问/ajax/test，地址会自动转发至common/data/async/test.json

* 在feather2中，因为使用了mustache通用模板引擎，所以采用了.json文件存储页面数据，lothar中则除了 同路径外的.json文件后，也支持.php文件结尾的页面数据文件，比如，模块下有一文件叫 page/a/b.html，则对应的页面数据文件则为 data/page/a/b.php 或 data/page/a/b.json

    ```php
    <?php
    return array(
        'title' => '123'
    );
    ```

    ```js
    {
        "title": "123"
    }
    ```

    页面引用
    ```
    <div>{{$title}}</div>
    ```
    
    lothar为了方便开发者本地调试，增了一个额外的变量 __debugData， 可打印出当前页面的所有数据，也可以通过浏览器访问http://ip:port/xxx.html?debugData的方式打印测试数据

    ```
    <?php var_dump($__debugData);?>
    ```

    当然你也可以通过使用blade自带的方法打印，只是结果可能不是你想要的

    ```
    <?php var_dump($__env->getShared());?>
    ```

    #### 注：标准的json文件，key必须包含双引号，而非单引号，并且，不能有注释， 另，lothar同样也支持 \_global\_.php文件进行全局数据加载，只是只会加载common模块下的该文件

* lothar中引用的几个扩展标签的写法需要转成blade的语法，如：

    ```html
    @extends('./xx')
    @widget('a')
    @pagelet('b#test')

    <!--第2个参数支持传递数据，数据只在被引用模块内生效-->
    @widget('a', array('title' => '123')) 
    ```

    #### 注： lothar暂时不支持block标签，请直接使用blade的section标签，具体文档可见[blade](http://www.golaravel.com/laravel/docs/5.1/blade/)

* lothar中跨模块引用时，需要在引用文件的前面加上  模块名: 的格式，如：

    main/index.html

    ```html
    @extends('common:layout')
    @widget('common:header')

    <link href="common:boostrap/css/bootstrap.css" rel="stylesheet" />
    <script>
    require.async('common:backbone')
    </script>
    ```

* 插件机制

    lothar对blade进行了扩展，支持插件，具体用法：

    common/plugins/datetime.php

    ```php
    function blade_plugin_datetime($expression){
        return '<?php echo date("Y-m-d H:i:s");?>';
    }
    ```

    common模块下的 index.html

    ```php
    现在时间: <div id="datetime">@datetime()</div>
    ```

    以上为lothar中使用的注意要点，具体部署可见[feather2/blade](https://github.com/jsyczhanghao/feather2-blade.git)


* 自定义标签

    lothar支持对blade进行自定义标签的扩展，具体用法：

    conf/conf.js
    ```js
    lothar.config.set('template.tags', {
        raw: ['{!!', '!!}'],
        content: ['{%', '%}'],
        escapedContent: ['{{{', '}}}']
    });
    ```

    index.html

    ```html
    <div>{%$name%}</div>
    ```

### 很重要的注：

lothar虽然不鼓励使用动态域名，但是支持，但，注意，但请使用以下2种语法：

conf/conf.js
```js
lothar.config.set('project.domain', '//<?=$xxx?>') //请注意，开头必须带上请求协议，不要有分号，也不要使用 <?php echo 这种语法，注意： 重要的事情只说一次
lothar.config.set('project.domain', '//{{$domain}}'); //blade输出值的语法也是支持的
```

#### 但是， 使用动态域名后， img也会添加上动态域名，而部分img是存在于css中，css文件不经过php的解析执行，所以，最终出来的页面一定是有问题的，所以，可以通过deploy配置的replace来解决此问题:

common模块 conf/deploy/xx.js
```js
module.exports = [
    //...此处N多配置
    {
        from: "/static",    //静态资源内的所有域名都给干掉
        to: "xxx",
        replace: {
            //去掉所有css中的出现的domain
            from: "//{{$domain}}",
            to: ""
        }
    },
    
    {
        from: "/view",  //view内的所有内容不做替换，包括map表
        to: "xxx"
    }
];
```
#### 如果使用了动态域名，则不建议在js文件中使用__uri进行url定位，1. 是因为存在css中图片一样的问题， 2. js中的出现的url一般是相对于页面的url，所以，即使替换掉，也很有可能无法找到正确的资源地址。 建议出现这种情况，可以在html页面中的script标签预先定义好js，如:

```html
<script>
var URL_CONFIG = {
    SWF: __uri('/static/ads.swf'),
    BG_IMG: __uri('/static/bg.png')
};
</script>
```

```js
var img = document.createElement('img');
img.src = URL_CONFIG.BG_IMG;
document.body.appendChild(img);
```
