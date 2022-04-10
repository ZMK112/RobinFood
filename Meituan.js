const musicNotify = () => {
	const m = '/storage/emulated/0/Download/WeiXin/平凡之路.mp3'
	media.playMusic(m);
	sleep(media.getMusicDuration());
}

const to_mall_cart = () => {
	shopping_cart_btn=id('img_shopping_cart').findOne()
		
	if(shopping_cart_btn){
		shopping_cart_btn.parent().click() //btn上一级控件可点击
		toast('已进入购物车')
	}else{
		toast('未找到购物车按钮，退出')
		exit;
	}
}

const pay = () =>{
	if(textStartsWith('立即支付').exists()){
		textStartsWith('立即支付').findOne().parent().click()
		musicNotify()
	}
}

const selectTime = (countT,status) =>{

	//选择送达时间
	textStartsWith('送达时间').findOne().parent().click()
	var selectedTime=null;
	hourClock_unfilterd=textContains(':00').find()
	hourClock=hourClock_unfilterd.filter(item => item.clickable&&item.checkable&&enabled)
	if(hourClock.length>0){
		selectedTime=hourClock[0]
	}else{
		quarClock_unfilterd=textContains(':15').find()
		quarClock=quarClock_unfilterd.filter(item => item.clickable&&item.checkable&&enabled)
		if(quarClock.length>0){
			selectedTime=quarClock[0]
		}else{
			halfClock_unfilterd=textContains(':30').find()
			halfClock=halfClock_unfilterd.filter(item => item.clickable&&item.checkable&&enabled)
			if(halfClock.length>0){
				selectedTime=halfClock[0]
			}else{
				clock_last_unfilterd=textContains(':45').find()
				clock_last=clock_last_unfilterd.filter(item => item.clickable&&item.checkable&&enabled)
				if(clock_last.length>0){
					selectedTime=clock_last[0]
				}
			}
		}
	}
	if(selectedTime!=null){
		selectedTime.parent().click()
		sleep(50)
		status=true
		pay()
	}else{
		countT=countT+1;
		if(countT>18000){
			toast('抢菜选择时间失败')
			exit;
		}
		sleep(100)
		selectTime(countT,false)

	}
}



const submit_order = (count) => {

		toast('抢菜第'+count+'次尝试')
		//美团买菜 结算按钮无id
		submit_btn=textStartsWith('结算').findOne()
		if(!submit_btn){
			toast('未找到结算按钮，退出')
			exit;
		}
		submit_btn.parent().click() //结算按钮点击

		sleep(1000)

		if(textStartsWith('我知道了').exists()){
			toast('配送运力已约满')
			textStartsWith('我知道了').findOne().parent().click()
		}else{
			if(textStartsWith('放弃机会').exists()){
				toast('跳过加购')
				textStartsWith('放弃机会').findOne().parent().click()
			}


			selectTime(0,false)
		}

		sleep(100)
		count=count+1;
		if(count>18000){
			toast('抢菜失败')
			exit;
		}
		submit_order(count)
}

const start = () => {
    kill_app('美团买菜')
    
	const appName = "美团买菜";
	launchApp(appName);
	sleep(600);  
	auto.waitFor()
	//跳过开屏广告
	btn_skip=id('btn_skip').findOne()
	if(btn_skip){
		btn_skip.click()
		toast('已跳过开屏广告')
	}
	sleep(600);  
	//跳过后加载首页会有一段时间再加载出购物车

	
	to_mall_cart()
	sleep(3000) //等待购物车加载完成
	submit_order(0)
		


}

function kill_app(packageName) {
    var name = getPackageName(packageName);
    if (!name) {
        if (getAppName(packageName)) {
            name = packageName;
        } else {
            return false;
        }
    }
    app.openAppSetting(name);
    text(app.getAppName(name)).waitFor();
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne();
    if (is_sure.enabled()) {
        textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne().click();
        buttons=textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*|确定|是)/).find()
        if(buttons.length>0){
            buttons[buttons.length-1].click()
        }
        
        log(app.getAppName(name) + "应用已被关闭");
        sleep(1000);
        back();
    } else {
        log(app.getAppName(name) + "应用不能被正常关闭或不在后台运行");
        back();
    }
}