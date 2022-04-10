"auto"
setScreenMetrics(1080, 1920);
toast("程序运行，正在打开每日优鲜");
app.launchApp("每日优鲜");

sleep(10000);
toast("等待完毕");
click(697,1818);
var times = 0;

while(true){
    var now = new Date();
    run();
    if (now.getHours() == 22 && now.getMinutes() == 29 && now.getSeconds() > 30){
        run();	
    }
    else{
        toast(now);
        sleep(1000);
    }
}

function run(){
    toast("开始结算");
    className("android.view.View").descContains("去结算").untilFind().click();
    var nstatus = 1;

    toast("开始选择");
    while(nstatus == 1 && times < 50000){
    if(className("android.view.View").descContains("请选择").exists()){
        className("android.view.View").descContains("请选择").findOne().click();
        nstatus = 2;
        break;
    }
    else if(className("android.view.View").descContains("知道了~").exists())
    {
        className("android.view.View").descContains("知道了~").findOne().click();
    }
    else{
        id("right_tv").click();
        className("android.view.View").descContains("去结算").click();
    }
    times++;
    }

    id("right_tv").click();
    toast("选择结束");                                                                                                                 

    if(nstatus == 2){
    toast("开始支付");
    lassName("android.view.View").desc("去支付").untilFind().click();

    toast("确认支付");
    className("android.view.View").desc("确定").untilFind().click();
    }

    toast("开始支付");
    className("android.view.View").desc("去支付").findOne(5000).click();

    toast("确认支付");
    className("android.view.View").desc("确定").findOne(5000).click();

    exit();
}