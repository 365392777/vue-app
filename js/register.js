$(function () {
    //1.点击获取验证码
    $('#btn_verify').on('tap', function () {
        //1.2获取手机号输入框的值
        var mobile = $('[name="mobile"]').val()
       
        //1.3验证手机号码是否正确
        var reg=/^1[3-9]\d{9}$/
        if(!reg.test(mobile)){
            mui.toast('手机号码输入错误')
            return false;
        }
        $.ajax({
            type: 'post',
            //1.4获取验证码的路径
            url: 'users/get_reg_code',
            data: {mobile:mobile},
            dataType: 'json',
            success: function (result) {
                console.log(result);
                //1.5如果获取验证码成功
                if(result.meta.status==200){
                    //1.6将获取到的数据值写入验证码输入框汇中
                    $('[name="code"]').val(result.data)
                }
            }
        })
    })

          
    //2实现注册
    $('.btn-register').on('tap',function () {
        //检测验证码是否为空
        var code = $('[name="code"]').val()
        if(code==''){
            mui.toast('验证码不能为空')
            return false;
        }
       //2.1验证邮箱
       var email = $('[name="email"]').val()
       //2.2验证手机号码是否正确
        var reg=/^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;   
       if(!reg.test(email)){
           mui.toast('邮箱格式错误,请输入正确的邮箱格式,如:163@qq.com')
           return false;
       }

         //2.3验证密码
         var pwd = $('[name="pwd"]').val()
         //2.2验证密码是否正确
         var reg=/^[a-zA-Z0-9]{4,10}$/;   
         if(!reg.test(pwd)){
             mui.toast('密码不能含有非法字符，长度在4-10之间')
             return false;
         }
           //2.4验证第二次密码
           var pwd2 = $('[name="pwd2"]').val()
           //2.5验证密码是否正确
           if(pwd!=pwd2){
               mui.toast('两次输入的密码不一致')
               return false;
           }

        //serialize 序列化   他可以获取当前表单中所有用用name属性的表单元素的value值
        console.log($('form').serialize());
        //3发起ajax请求
        $.ajax({
            type:'post',
            url:'users/reg',
            //3.1收集所有表单数据
            data:$('form').serialize(),
            dataType:'json',
            success:function (result) {
                console.log(result);
                //3.2如果注册成功
                if(result.meta.status==200){
                   mui.toast('注册成功')//提示登录成功
                   setTimeout(() => {
                       //3.3跳转到首页
                       location.href="./login.html"
                   }, 1000);
                }else{
                    //3.4如果注册不成功,则提示错误信息
                    mui.toast(result.meta.msg)
                }
            }
        })
    })
})