$(function () {

    //1滑动区域滚动组件默认为absolute定位，全屏显示；在实际使用过程中，需要手动设置滚动区域的位置（top和height）
    // 若使用区域滚动组件，需手动初始化scroll控件
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false  //是否显示滚动条，默认为True
    });

    function init() {
        //2发起ajax请求
        $.ajax({
            type: 'get',
            url: 'my/cart/all',
            dataType: 'json',
            success: function (result) {
                console.log(result);//{data: {…}, meta: {…}}
                //2.1 因为获取到的数据是对象字符串格式,无法遍历渲染数据,为方便渲染数据,获取到数据中的cart_info,转换成对象键值对格式,并赋值infoData,方便使用
                var infoData = JSON.parse(result.data.cart_info)
                // console.log(infoData);
                // console.log(infoData);//{43965: {…}, 47869: {…}, 57445: {…}}
                //2.2将拿到的数据包存储到list中,template渲染模板更方便获取到数据
                var html = template('orderTemp', { 'list': infoData })
                $('.order_list').html(html)
                //2.3 mui在mui.init()中会自动初始化基本控件,但是 动态添加的Numbox组件需要手动初始化
                mui('.mui-numbox').numbox()
                //2.4计算总和,页面一出来应该就需要计算商品的总和
                calcTotalPrice()
            }
        })
    }
    init()
    //3点击编辑的时候切换类
    $('.btn-edit').on('tap', function () {
        // 3.1切换body的样式，实现元素的统一的显示和隐藏
        $('body').toggleClass('eleToggle')
        // 3.2判断当前按钮的显示文本是‘编辑’还是'完成'
        if ($(this).text() == '编辑') {
            // 3.3设置文本内容
            $(this).text('完成')
        } else {
            $(this).text('编辑')
            // 7.2将用户编辑更新到数据库 -- syncCart同步购物车
            //调用编辑商品完成后的同步方法,传入参数,参数是商品所有的列表
            syncCart($('.order-singer'))
            // alert('触发')
            mui.toast('编辑完成')
        }
    })
    //4 计算总价格
    //我们需要的是每一个商品的数据*它的价格=和
    //4.1计算总价在开始的时候需要计算,在后期进行数量的修改时候和删除商品的时候都需要重新计算,所以将计算总价封装为一个函数方法
    //我们需要所有商品的数据,但是这个数据却不能简单的从ajax中获取,因为这样后期进行数据的修改无法及时的更新,当我点击编辑个数的时候,如果发起ajax请求数据,这样的数据是不准确的
    //4.2解决方法,考虑后期的编辑和删除需要获取的参数是商品的所有数据,而不仅仅是价格和数量,我们就考虑将当前商品的所有数据都存储到父级的自定义属性中
    // <div class="order-singer" data-order='{{value}}'>
    //4.3价格不能修改,所以可以从自定义属性中直接获取
    //4.4用户可以自由的修改数量,所以总数不要在自定义属性中获取,因为这样无法获取到用户的最新修改数据,多以数量应该从自定义属性存储的数据中获取
    var total
    function calcTotalPrice() {
        //5计算总价格
        //初始为0 
        total = 0
        //5.1获取所有的商品列表,获取到的是一个数组
        var allOrder = $('.order-singer')
        //循环遍历数组
        allOrder.each(function (index, value) {
            // console.log(value);
            //5.2计算价格进行累加:数量*价格
            //5.3在自定义属性中获取到数据的价格,因为是dom,所以需要转换成jq对象
            var price = $(value).data('order').goods_price//数据中的商品价格
            // console.log(price);
            //5.4获取到数量,数量是用户点击的,所以需要去input中获取
            var num = $(value).find('#test').val()//数据中的商品数量
            // console.log(num);
            total = total + (price * num)//数量和价格相乘,累加
            // console.log(total);
        })
        //5.5将累加的价格写入到总价格中
        $('.price').text('￥' + total)
    }
    //6单击+ - 按钮的时候调用计算价格总和 calcTotalPrice()方法,并将内容text()到总价内容中
    //由于数据的动态渲染的,所以要找到他的顶级父元素来添加委托事件,让他的子元素点击
    $('.order_list').on('tap', '.pyg_userNum .mui-btn', function () {
        //调用计算价格总和方法
        calcTotalPrice()
    })

    //7同步购物车,将用户的数据更新提交到服务器
    //之前我们获取数据的格式是什么,那么提交个数据格式也必须一致,用户可以修改的值就是购买商品的数量
    //7.1我们可以从自定义属性获取数据,生成后台结构所需要的格式
    //allList 就是需要同步 $('.order_list')的数据,在上面7.2调用并传入所有的商品作为参数
    function syncCart(allList) {
        //7.3收集数据,一定要符合后台的需求
        //7.4创建空对象
        var list_obj = {}
        //7.5循环遍历dom结构获取到的所有商品列表数据
        for (var i = 0; i < allList.length; i++) {
            //7.6获取自定义属性中存储的商品列表数据,因为是dom是结构,所以需要转换成$.jquery对象
            var data = $(allList[i]).data('order')
            // console.log(data);
            // console.log(typeof data.goods_id)
            //获取到的结果 {cat_id: 5, goods_id: 43986, goods_name: "海信(Hisense)LED55MU9600X3DUC 55英寸 4K超高清量子点电视 ULED画质 VIDAA系统", goods_number: 100, goods_price: 13999, …}
            //7.7注意重置用户修改的数量,获取到 +- 修改的值赋值给data.amount中
            data.amount = $(allList[i]).find('#test').val()
            //7.8后台所需要的数据格式是键值对,空对象中添加了数据,原来是什么样子,传回去后台就是什么样子给到后台更新
            //将data数据添加到,data.goods_id:data  
            // 这样的键值对{26995: {…}, 47869: {…}, 54793: {…}}
            list_obj[data.goods_id] = data
        }
        console.log(list_obj)
        //7.9发起ajax请求
        $.ajax({
            type: 'post',
            url: 'my/cart/sync',
            data: {
                'infos': JSON.stringify(list_obj)
            },
            success: function (result) {
                console.log(result);
                init()
            }
        })
    }

    //8点击删除商品
    $('.btn-del').on('tap', function () {
        //8.1找到当前的渲染顶级父元素,找到没有勾上复选框状态的元素
        var cked = $('.order_list').find('[type="checkbox"]').not(':checked').parents('.order-singer')
        // console.log(cked);
        //8.2调用mui插件
        mui.confirm('确认删除?', '警告!', ['是', '否'], function (e) {
            if (e.index == 0) {
                //8.3如果用户点了是,那么删除商品,并刷新
                syncCart(cked)
                init()
                mui.toast('删除成功')
            } else {
                //8.4如果用户点击否,那么则不做任何操作
            }
        })
    })

    //9 点击生成订单 pyg_createOrder,生成订单,首先需要看后台数据需要传入什么数据作为 参数
    $('.pyg_createOrder').on('tap', function () {
        //9.1最关键的就是生成后台接口所 需要的数据
        var order = {
            "order_price": total, //总价格
            "consignee_addr": $('.userAddress').text(),//送货的地址
            "goods": []
        }
        //9.2获取所有的商品,返回的是一个数组
        var allOrder = $('.order-singer')
        //9.3玄幻遍历数据,拿到需要的数据
        allOrder.each(function (index, value) {
            var singer = {}//创建空对象
            //9.4获取到自定义属性存储的数据到变量中,获取到的是一个对象
            var temp = $(value).data('order')
            //9.5将自定属性的存储中的数据拿到
            singer.goods_id = temp.goods_id
            singer.goods_number = temp.goods_number
            singer.goods_price = temp.goods_price
            //9.6最后将singer的数据追加到order.goods[]中
            order.goods.push(singer)
        })
        console.log(order)
        //9发起ajax请求
        $.ajax({
            type: 'post',
            url: 'my/orders/create',
            data: order,//将获取的订单信息作为数据发送
            dataTyep: 'json',
            success: function (result) {
                console.log(result);
                mui.toast('生成订单成功')
                location.href = "./orderList.html"
            }
        })
    })

    //10 使用mui插件   picker 选择器进行地址选择
    $('.selectAddress').on('tap', function () {
        //10.1创建对象,上设置为三级联动
        var picker = new mui.PopPicker({
            layer: 3
        });
        //10.2给picker对象添加数据,添加的数据只能是数组
        picker.setData(data)  //data在 data文件中 的js中,里面的数据是全国的地址
        //10.3显示picker,参数是一个回调函数,在回调函数有一个参数
        picker.show(function (items) {
            console.log(items);
            //10.4将选中的地址为地址赋值,让内容显示在配送地址上
            $('.userAddress').text(items[0].text + '-' + items[1].text + '-' + items[2].text)
        })
    })


})