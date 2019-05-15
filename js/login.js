$(function () {
    //   1点击确定登录的按钮
    $('.mui-btn-primary').on('tap', function () {
        //1.1收集用户数据,方便ajax传递数据
        var obj = {
            username: '',
            password: ''
        }
        //1.2获取账号和密码值存储到obj对象中,方便使用
        obj.username = $('.username').val()
        obj.password = $('.password').val()
        // console.log(obj.username);
        // console.log(obj.password);

        //2进行相应的验证账号和密码是否合法test 校正
        if (!/^1[3-9]\d{9}$/.test(obj.username)) {
            //2.3调用提示框
            mui.toast('手机号码输入不正确')
            return false;
        }//2.4判断密码的长度
        if (obj.password.length < 6) {
            mui.toast('密码长度小于6位')
            return false;
        }
        //3发起ajax请求
        $.ajax({
            type: 'post',
            //3.1请求登录数据
            url: 'login',
            //3.2传入上面已经获取到的用户账号密码
            data: obj,
            dataType: 'json',
            success: function (result) {
                // 13112345678 使用注册过的手机号登陆
                console.log(result);
                //如果登录成功状态码为200
                if (result.meta.status == 200) {
                    // console.log(222222222);
                    //3.3登陆成功后打印数据获取token值,将token值存储到本地
                    //token值
                    //  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEzLCJpYXQiOjE1NTQ2Mzk4MDAsImV4cCI6MTU1NDcyNjIwMH0.MB0t7unlBf9Zf2IT9kt36-nBvcSNxRnhCxmBT9ITWpI"
                    //3.4将当前的token值存储到本地,方便goodsDetail.js 获取本地存储的token值来判断
                    sessionStorage.setItem('pyg_token', result.data.token)
                    //3.5进行页面的跳转 ,调用切割url方法,将问号?后面的参数传递过去,切割好的数据赋值给re

                    // 3.6原地址栏url中的数据  http://127.0.0.1:5500/01pyg/views/login.html?redirectUrl=http%3A//127.0.0.1%3A5500/01pyg/views/goodsDetail.html%3Fgoods_id%3D57442
                    var re = $.getParameter(location.search).redirectUrl
                    //   alert( $.getParameter(location.search).redirectUrl)
                    // 3.7 $.getParameter(location.search).redirectUrl
                    // 获取到的结果是 ? 问号后面 .redirectUrl 的参数,就是http%3A//127.0.0.1%3A5500/01pyg/views/goodsDetail.html%3Fgoods_id%3D57442
                    //3.8如果能够获取url地址栏
                    if (re) {
                        alert('成功获取到--->登录页面获取到url地址栏问号后面 ?redirectUrl的值')
                        //unescape反转义url中地址栏的% / =号 并重新定向 
                        location.href = unescape(re)
                    } else {
                        //3.9如果没url值就直接跳到首页
                        alert('失败获取--->url地址栏 问号?redirectUrl的值,为你跳转到首页')
                        location.href = '../index.html'
                    }
                } else {
                    //如果登陆失败,那么就提示401
                    mui.toast(result.meta.msg)
                }
            }

        })
    })

    //点击注册的按钮
    $('.MY_content_register').on('tap', function () {
        location.href = "./register.html"
    })
})