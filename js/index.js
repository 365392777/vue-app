$(function () {
    banner()
    commodity()
     //解决mui插件默认阻止a链接跳转行为
    mui('body').on('tap', 'a', function (e) {
        e.preventDefault()
        window.top.location.href = this.href;
    });


})
// 生成首页动态轮播图
function banner() {
    // 动态生成轮播图结构
    $.ajax({
        type:'get',
        url:'home/swiperdata',
        dataType:'json',
        success:function (result) {
            // console.log(result);
            // 只有获取数据成功了，才有必要生成动态结构
                // 生成图片结构
            if(result.meta.status==200){
                 var bannerHTML=template('bannerTemp',result)
                 $('.mui-slider-loop').html(bannerHTML)
                 // 如果轮播图是动态生成就需要重新手动初始化
                 var gallery = mui('.mui-slider');
                 gallery.slider({
                     interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
                 });
            }
            //小圆点
            var dotTHML=template('dotTemp',result)
            $('.mui-slider-indicator').html(dotTHML)
        }
    })
}

function commodity() {
    $.ajax({
        type:'get',
        url:'home/goodslist',
        dataType:'json',
        success:function (result) {
            // console.log(result);
            var commodityHTML=template('commodityTemp',result)
            $('.commodityAll').html(commodityHTML)
        }
    })
}

