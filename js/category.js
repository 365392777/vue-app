$(function () {

    //4rander()的数据渲染
    rander()
    var data //全局变量数据
    //4.1由于每次点击都需要发起ajax请求数据,这样会给后台服务器添加压力,所以有了这样的想法,将数据存储在本地localStorage
    //后期每次单击左侧菜单项的时候,我们获取对应的二级分类数据,我们可以获取菜单项的索引值,获取数据存储对应索引值的位置数据
    //在真正获取数据的时候,先获取本地存储数据,并且判断数据村粗时候超时,如果没有超时,那么直接使用本地数据进行渲染,如果超时,就再次发起ajax请求
    //4.2所以在进行本地处数据村粗的时候,我们除了存储数据,还有存储一个当前的时间(毫秒数)

    function rander() {
        //5.1先获取在ajax发起请求拿回来的本地存储数据,并转回对象
        data = JSON.parse(localStorage.getItem('localData'))
        // console.log(data);
        //5.2如果当前的数据不为null空,并且用当前的时间-本地存储的时间小于24*60*60*1000的话,那么就重新渲染,否则不渲染
        if (data && Date.now() - data.time < 24 * 60 * 60 * 1000) {
            leftListdata() 
            //渲染的时候传入索引0,默认渲染第一个二级列表
            rightListdata(0)
        }else{
            getCateData()
        }
    }
    // getCateData()
    //1先发起ajax请求数据回来,然后渲染左边右边菜单项
    function getCateData() {
        //数据渲染的时候先出现等待效果
        $('body').addClass('loadding')
        //1发起ajax请求
        $.ajax({
            type: 'get',
            url: 'categories',
            dataType: 'json',
            success: function (result) {
                // console.log(result);
                //1判断数据是否能够成功响应回来
                if (result.meta.status == 200) {
                    //1.1获取当前的时间和对象封装成对象
                    //设置全局变量,方便其他函数的使用到数据
                    data = {
                        'list': result.data,
                        time: Date.now()
                    }
                    //1.2将数据转换成字符串,存储到本地内存
                    // localStorage是永久存储 sessionStorage 是会话存储,关闭页面就没有了
                    //1 浏览器交互是字符串
                    //2读写文件是字符串
                    //3本地存储是字符串
                    localStorage.setItem('localData', JSON.stringify(data))
                    //1.3调用左边函数渲染
                    leftListdata()
                    //1.4调用左边函数渲染
                    rightListdata(0)
                }
            }
        })
    }

    //2左边一级分类列表
    function leftListdata() {
        //2.1渲染数据
        var html = template('leftTemp', data) //此时这里传入的数据就是list,在html那边玄幻的时候也是list.点下面的属性即可获取到下面的数据 
        // console.log(data);
        $('.left ul').html(html)
        //2.2获取到数据以后就调用滑动的mui插件初始化
        var myScroll = new IScroll('.left')
        //2.3给父级 元素添加委托事件,让下面的子元素点击触发
        $('.left').on('tap', 'li', function () {
            //2.4切换样式
            $(this).addClass('active').siblings().removeClass('active')
            //2.5让li顶置到ul上面
            myScroll.scrollToElement(this)
            //2.6获取到当前点击li的索引值,方便去和右边的二级分类列表关联
            var index = $(this).index()
            //2.7调用右边的方法,并传入索引值作为参数,方面使用
            // console.log(index);
            rightListdata(index)
        })
    }

    //3右边二级分类列表
    function rightListdata(index) {
        //3.1数据渲染
        //3.2先调用template模板渲染,传入id,和数据中的被左边点击的索引值进行左右分类栏的关联
        var html = template('rightTemp', data.list[index])
        //  console.log(html);
        $('.rightList').html(html)
        //3.3发现问题1,数据回来了,但是拖动上下滑动的时候,发现拖不动,是图片的高度问题,因为是异步请求,所以请求的数据没有回来,所以拖不动
        //问题2,发现刷新的时候没有图片,需要在数据发起ajax请求的时候调用并传入索引值0,就是第一个数据列表,渲染数据出来
        //3.4解决问题
        //需要获取到所有二级 分类的图片,添加绑定图片加载完毕事件
        //3.5获取所有的图片个数
        var imgLength = $('.right img').length
        console.log(imgLength); //55个
        //3.6给图片添加加载事件
        $('.right img').on('load', function () {
            //3.7每加载完毕一张图片 减一张
            imgLength--
            if (imgLength == 0) {
                //3.8数据加载完毕移出等待效果
                $('body').removeClass('loadding')
                //3.9如果全部图片加载完毕后则可以滑动
                var myScroll = new IScroll('.right')
            }
        })
    }
})