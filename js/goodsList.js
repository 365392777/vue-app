$(function () {
    // 单击搜索按钮实现侧滑效果
    $('.mui-icon-search').on('tap', function () {
        mui('.mui-off-canvas-wrap').offCanvas('show');
    })

    // 2由于需要传入多个参数,所以直接封装成对象作为ajax的data的参数传递
    var data = {
        // query: '',
        // <a href="goodsList.html?cid={{v.cat_id}}">
        //2.1通过location.search来获取,分类页面点击的id ?问号后面?cid=8
        // cid:location.search,
        //2.2直接调用,getParameter()方法传入并传入参数
        //2.3通过getParameter(location.search)切割好的数据,是个对象直接点.cid就是相当于 cid:5,作为data的数据参数
        cid: getParameter(location.search).cid,//5
        pagenum: 1,
        pagesize: 10

    }
    // console.log(data.cid); //5


    // 1,发起ajax获取数据
    // 1.2封装函数原因是：后期下拉和上拉的时候需要重新加载数据
    function renderMainData(callback,obj) { //4.3传入回调函数,这里的obj就是query属性
        console.log(data) //获取封装的对象
        $.ajax({
            type:'get',
            url: 'goods/search',
            //1.3将数据对象data传入,由于需要通过分类页面的id查到相关的页面信息,所以需要传入参数
            // $.extend(obj1,obj2):将obj2的成员添加到obj1中，如果成员名称不一样，就累加，如果成员名称一致就覆盖
            data:$.extend(data,obj),//将客户搜索的数据添加一个参数到数据中
            dataType: 'json',
            success: function (result) {
                //1.4获取数据
                console.log('---->',result)
                // cid: "?cid=8"
                // pagenum: 1
                // pagesize: 10
                // query: ""
                //4.2发现上拉加载,和下拉刷新都用到数据发起ajax,所以用到回到回调函数去简化代码,并传入数据做为实参
                callback(result) 
                // var html = template('goodlistTemp',result.data)
                // $('.goodslist').html(html)
            }
        })
    }

    
    //4.使用下拉加载,上拉刷新的mui插件
    mui.init({
        //swipeBack滑动返回
        swipeBack: false,
        //pullRefresh下拉刷新
        pullRefresh: {
            //#refreshContainer这个id值是 写在了<!-- 主页面内容容器 中-->
            // <div class="mui-content mui-scroll-wrapper" id="refreshContainer">
            container: "#refreshContainer",//container容器,
            // 下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            // down:说明这是下拉的初始化
            down: {
                height: 50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    //  4==================
                    //4.1每次下拉刷新都将页面数重置为第一页
                    data.pagenum = 1
                    //4.2调用回调函数发起ajax请求
                    renderMainData(function (result) {
                        //4.4渲染数据
                        var html = template('goodlistTemp',result.data)
                        // console.log(html);
                        $('.goodsList').html(html)//渲染到ul中
                        //4.5当数据渲染完毕的时候,讲下拉刷新的样式隐藏
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 4.6为了防止切换分类的时候，无法再上拉，所以在每次刷新的时候将上拉加载重新启用
                        mui('#refreshContainer').pullRefresh().refresh(true)
                    })

                }
            },
            // 5上拉加载更多数据
            up: {
                height: 50,//可选.默认50.触发上拉加载拖动距离
                auto: false,//可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    //5.1每次上拉加载数据都++1,加载下面的数据
                    data.pagenum ++ 
                    //5.2调用renderMainData()方法,接收数据参数,渲染数据
                    renderMainData(function(result){
                        //5.3如果上拉的时候没有数据了则提示没有数据,如果有则继续渲染
                        if(result.data.goods.length > 0){
                            var html = template('goodlistTemp',result.data)
                            //5.4上拉加载数据是追加,下拉是覆盖
                            $('.goodslist').append(html)
                            //5.5数据加载完毕隐藏 加载效果
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                        }else{
                            //5.6如果没有数据则提示,没有更多的数据
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                        }
                    })
                }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });



    // 3 发现传入的cid: location.search, 是这样子的 ?cid=5
    //后面也可能有 通过&来拼接,所以需要分割 ?cid=5&name=jack
    //先按substring字符串分割获取到?后面的数据,在通过split(&)分割,再循环遍历数组中的split('=')号,将分割好的数据赋值给空的obj={}
    //3.1这里 getParameter(url)接收到的参数是  
    // cid:getParameter(location.search).cid, 传入的参数
    function getParameter(url) {
        //3.2首先先创建空对象
        var obj = {}
        //3.3 location.search获取到的数据是url中?及?后面的内容
        //通过url.substring(1)截取字符串?问号后边的数据cid=5&name=jack
        url = url.substring(1) //cid=5&name=jack
        // console.log(url);//cid=5
        // 3.4先按&拆分  url.split('&'),拆分出来是数组
        var arr = url.split('&') //split分离成['cid=5','name=jack']
        // 3.5遍历数据进行第二次拆分=号去掉['cid=5','name=jack']
        for (var i = 0; i < arr.length; i++) {
            //3.6arr[i].split('=')方式分割数组
            var temp = arr[i].split('=')
            // console.log(temp);//['cid',5]
            //3.7将分割好的数据/['cid',5]的索引值1,就是对应索引id号存放到obj[第0项]
            //3.8关键的是,将数据中的索引值0和1赋值,就是将id值存到cid中
            obj[temp[0]] = temp[1]
            // 输出obj 相当于 obj['cid']= 5
            // console.log(obj);//{cid: "5"}
            // console.log(obj[temp[0]]);//ID号是 5
        }
        //3.9将分割好的数据返回
        return obj
    }

    //5渲染右边侧滑的搜索数据
    //当点击按钮的时候渲染数据
 $('.query_btn').on('tap',function () {
     //展开运算符+对象解构
     //创建一个空的obj,方便将query存储到里边
      var obj={}
      //5.2拿到输入框的值,赋值给query属性中
      obj.query=$('.query_txt').val()
      //5.3调用ajax方法渲染数据
      renderMainData(function (result) { 
             console.log(result);
          var html=template('searchListTemp',result.data)
          //5.4添加到右边的侧滑搜索区域中
          $('.searchList').html(html)
      },obj)
 })


})