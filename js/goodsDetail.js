$(function () {

    //1滑动区域滚动组件默认为absolute定位，全屏显示；在实际使用过程中，需要手动设置滚动区域的位置（top和height）
    // 若使用区域滚动组件，需手动初始化scroll控件
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false  //是否显示滚动条，默认为True
    });
    //当渲染完毕数据以后将轮播图的初始化放到success中
    // //2获得slider插件对象
    // var gallery = mui('.mui-slider');
    // gallery.slider({
    //     interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
    // });

    // 4.发现详情页面中需要传入的参数较多,所以直接将需要传入的数据存放在对象中
    // 4.7商品对象的JSON字符串
    var info = {
        cat_id: '',
        goods_id: '',
        goods_name: '',
        goods_number: '',
        goods_price: '',
        goods_small_logo: '',
        goods_weight: ''
    }

    //3发送ajax请求,获取当前商品详细数据
    $.ajax({
        type: 'get',
        url: 'goods/detail',
        //3.1发现我们需要传入参数,用到之前封装好的getParameter的切割路径方法,所以直接在goodslist.js中剪切代码放到公共部分common.js中,
        // 而这里不能够直接使用到,所以直接将方法扩展到zepto的$中方便调用方法使用
        data: $.getParameter(location.search),//url中的id号
        dataType: 'json',
        success: function (result) {
            // console.log(result);
            // 4.8为info赋值
            info.cat_id = result.data.cat_id
            info.goods_id = result.data.goods_id
            info.goods_name = result.data.goods_name
            info.goods_number = result.data.goods_number
            info.goods_price = result.data.goods_price
            info.goods_small_logo = result.data.goods_small_logo
            info.goods_weight = result.data.goods_weight
            //3.2渲染数据
            var html = template('gdTemp', result.data)
            //console.log(html);
            $('.mui-scroll').html(html)
            //3.3获得slider插件对象 滑动轮播图
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
            });
        }
    })

    //4添加商品到购物车
    $('.btn-addCart').on('tap', function () {
        // console.log('进入购物车');
        //4.1判断是否有token令牌的意思,如果没有,则重新定向到登录页面
        //4.2约定使用sessionStorage会话存储
        //获取到登陆页面的token值
        var mytoken = sessionStorage.getItem('pyg_token')
        //    console.log(mytoken);
        // alert(mytoken)//检测token是否为空
        //4.3如果没有token,则重新定向到登录页面
        if (!mytoken) {//4.3如果token值为空那么重新定向
            //4.4需要注意的是重新定向,如果用户没有登录就直接点击购物车,直接跳到登录页,登录完以后,就会重新定向页面跳转到商品的首页
            //    alert(1)  检测
            //redirectUrl 重新定向url地址栏
            //   alert('./login.html?redirectUrl='+escape(location.href))
            //4.5通过location.href 定向到login 登陆页面,并通过escape 转义,拼接 原来的地址栏路径到 地址栏,6第一次点击购物车肯定是没有token值,所以会重新定向到登录页面,登录成功后,拿到token值
            //redirectUrl=  是可以自己定义的 传到 login 登录页面中,
            location.href = './login.html?redirectUrl=' + escape(location.href)
            // 1. location.href 获取到的是地址栏所有的地址
            // 2. location.search 获取到的是地址栏? 问号 后面的参数
            // alert(location.href) 结果//http://127.0.0.1:5500/01pyg/views/goodsDetail.html?goods_id=57442
            //4.6如果有token值,那么就发送请求
        } else {
            $.ajax({
                type: 'post',
                url: 'my/cart/add',//购物车添加商品url
                //4.7需要用到的商品对象的属性有很多,所有直接放到全局变量中,作为字符串进行数据的传递
                data: {
                    //传入对象 键值对
                    info: JSON.stringify(info)
                },
                dataType: 'json',
                success: function (result) {
                    //  alert(2)检测
                    // console.log(result);
                    //如果token超时
                    if (result.meta.status == 401) {
                        //  4.8通过url编码来实现href的传递
                        location.href = './login.html?redirectUrl=' + escape(location.href)
                    } else {
                        //4.9提示用户是否跳转到购物车页面,这是mui提示插件的js代码
                        mui.confirm('添加成功,是否查看购物车', '温馨提示', ['跳转', '取消'], function (e) {
                            if (e.index == 0) {
                                // 如果点击了跳转,那么直接跳到购物车页面
                              location.href='./cart.html'
                            } else {
                                // 如果点击取消,则不跳转,在原页面
                            }
                        })
                    }
                }
            })
        }
    })
})