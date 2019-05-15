$(function () {


    $.ajax({
        type: 'get',
        url: 'my/orders/all',
        data: { type: 1 },
        dataType: 'json',
        success: function (result) {
            console.log(result);
            // var num0=result.data[0].order_number
            // var num1=result.data[1].order_number
            // console.log(num0);
            // console.log(num1);
            var html = template('orderLisTemp', result)
            // console.log(html);
            $('.allOrderList').html(html)
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005,
                indicators: false //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
        }
    })
})