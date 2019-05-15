$(function () {
    //1点击个人中心的时候发送ajax请求
    $('.myContent').on('tap', function () {
        $.ajax({
            type: 'get',
            url: 'my/users/userinfo',
            dataType: 'json',
            success: function (result) {
                console.log(result);
                var username = result.data.username
                var user_email = result.data.user_email
                $('.account').text(username)
                $('.account_email').text(user_email)
            }
        })
    })
    //2点击退出登录按钮,清除token值,并跳到登录页
    $('#drop_out').on('tap', function () {
        //2.1调用mui插件
        mui.confirm('确认退出登录?', '警告!', ['退出', '取消'], function (e) {
            if (e.index == 0) {
                //2.2如果用户点了是,那么删除商品,并刷新
                mui.toast('退出登录成功')
                setTimeout(() => {
                    //2.3清理token值
                    sessionStorage.removeItem("pyg_token");
                    //2.4并跳转到登录页
                    location.href = './login.html'
                }, 1000);
            } else {
                //2.4如果用户点击否,那么则不做任何操作
            }
        })

    })

    //3点击代付款跳转到购物车订单页,为多个元素添加绑定同一个事件,用逗号,隔开
    $('.payment,.receiving,.sale,.all_orders').on('tap', function () {
        location.href = "./orderList.html"
    })
    // $('.receiving').on('tap', function () {
    //     location.href = "./orderList.html"
    // })
    // $('.sale').on('tap', function () {
    //     location.href = "./orderList.html"
    // })
    // $('.all_orders').on('tap', function () {
    //     location.href = "./orderList.html"
    // })
})