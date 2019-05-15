$(function () {

      //默认情况下,mui不像样click单击事件,这是他的默认行为
    //我们解决方式就是重新为所有的A绑定tap
    mui('body').on('tap', 'a', function (e) {
      e.preventDefault()
      window.top.location.href = this.href;
  });

  //先定义一个基准的路径,就是相同的路径,后面拼接在ajax发起请求的路径,再赋值给url
    const baseURL='http://157.122.54.189:9094/api/public/v1/'
     //添加zepto拦截器,他的作用是可以让每个ajax请求都经过这个函数精心处理
     $.ajaxSettings.beforeSend=function (xhr,obj) {
          //在正在加载的时候添加加载效果
        $('body').addClass('loadding')
        // console.log(obj)
        //拼接路径
        obj.url=baseURL+obj.url

        //判断每一个页面是不是带有my的一个私有路径,如果有的话继续判断,有没有token值,如果没有的话,跳转到登录页,如果有的话直接设置上token,例如在没有登录的时候就点击购物车,这个时候是没有token值的,那么需要在导航守卫上继续判断一下请求的私有路径my
        if(obj.url.indexOf('/my/') != -1){
          /* 路由守卫 导航守卫 */
          if(sessionStorage.getItem('pyg_token')){//如果有
            xhr.setRequestHeader('Authorization',sessionStorage.getItem('pyg_token'))
          }else{//如果没有,跳到登录页
            location.href = 'login.html'
          }
      }
     }
     $.ajaxSettings.complete=function () {
         //在完成的时候移除加载效果
        $('body').removeClass('loadding')
     }


        // 3 发现传入的cid: location.search, 是这样子的 ?cid=5
    //后面也可能有 通过&来拼接,所以需要分割 ?cid=5&name=jack
    //先按substring字符串分割获取到?后面的数据,在通过split(&)分割,再循环遍历数组中的split('=')号,将分割好的数据赋值给空的obj={}
    //3.1这里 getParameter(url)接收到的参数是  
    // cid:getParameter(location.search).cid, 传入的参数

  //通过extend动态扩展zepto中的成员
  $.extend($,{
    getParameter:function (url) {
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
          //  console.log(obj);//{cid: "5"}
          //  console.log(obj[temp[0]]);//ID号是 5
       }
       //3.9将分割好的数据返回
       return obj
    }
  })
})



