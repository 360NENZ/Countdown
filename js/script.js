var monthname = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
	function padding(topad)
{
    topad = topad.toString();
    if (topad.length == 1)
    {
    topad = '0' + topad;
    };
    return topad;
};
function tempus()
{
    now = new Date();
    document.getElementById("time").innerHTML = padding(now.getHours()) + ':' + padding(now.getMinutes()) + ':' + padding(now.getSeconds());
    document.getElementById("date").innerHTML = now.getFullYear() + '年' + monthname[now.getMonth()] + '月' + now.getDate()+ '日';
    setTimeout("tempus()", 1000);
};
$(function()
{
	//active snow
	if($.isFunction($.fn.snowy))
	{
		$('.snowy').each(function()
		{
			//check for data
			if($(this).is('[data-snowy]'))
			{
				$(this).snowy($(this).data('snowy'));
			}
			else
			{
				$(this).snowy();
			}
		});
	}
	
	//countdown
	if($.isFunction($.fn.countdown))
	{
		$('.countdown[data-date]').countdown(
		{
			date: $(this).data('date'),
			render: function(data)
			{
				$(this.el).html
				(
					"<div class=\"countdown-box\"><H4 class=\"countdown-number\">" + data.days + "</H4>" + " <h4 class=\"countdown-title\">天</h4></div>" +
					"<div class=\"countdown-box\"><H4 class=\"countdown-number\">" + data.hours + "</H4>" + " <h4 class=\"countdown-title\">时</h4></div>" +
					"<div class=\"countdown-box\"><H4 class=\"countdown-number\">" + this.leadingZeros(data.min, 2) + "</H4>" + " <h4 class=\"countdown-title\">分</h4></div>" +
					"<div class=\"countdown-box\"><H4 class=\"countdown-number\">" + this.leadingZeros(data.sec, 2) + "</H4>" + " <h4 class=\"countdown-title\">秒</h4></div>"
				);
			}
		});
	}
	
	//fullpage
	if($.isFunction($.fn.fullpage))
	{
		$('.fullpage').fullpage(
		{
			navigation: true,
			verticalCentered: true,
			afterRender: function()
			{
				//get container
				var container = $(this);
				//find section count
				var count = container.find('.section').length;
				//create previous slide button
				var prev = $('<a href="#" class="fp-prev"><i class="fa fa-arrow-up" aria-hidden="true"></i></a>');
				//create next slide button
				var next = $('<a href="#" class="fp-next"><i class="fa fa-arrow-down" aria-hidden="true"></i></a>');
				//add previous slide button action
				prev.on('click', function(e)
				{
					e.preventDefault();
					$.fn.fullpage.moveSectionUp();
				});
				//add next slide button action
				next.on('click', function(e)
				{
					e.preventDefault();
					$.fn.fullpage.moveSectionDown();
				});
				//add buttons to body
				$('body').append(prev);
				$('body').append(next);
				//set prev as unvisible
				prev.addClass('unvisible');
				//check for slides
				if(count <= 1)
				{
					//set next as unvisible
					next.addClass('unvisible');
				}
				//set prev data section
				prev.attr('data-section', 1);
				//set next data section
				next.attr('data-section', Math.min(count, 2));
			},
			afterLoad: function(anchorLink, index)
			{
				//get section
				var section = $(this);
				//find section count
				var count = section.parent().find('.section').length;
				
				//check for first section
				if(index == 1)
				{
					//hide prev slide
					$('.fp-prev').removeClass('visible').addClass('unvisible');
				}
				else
				{
					//show prev slide
					$('.fp-prev').removeClass('unvisible').addClass('visible');
				}
				
				//check for last section
				if(index == count)
				{
					//hide next slide
					$('.fp-next').removeClass('visible').addClass('unvisible');
				}
				else
				{
					//show next slide
					$('.fp-next').removeClass('unvisible').addClass('visible');
				}
				
				//set data section tags
				$('.fp-prev').attr('data-section', Math.max(1, index - 1));
				$('.fp-next').attr('data-section', Math.min(count, index + 1));
			}
		});
	}
	
	//audio player
	$('.audio-player').each(function()
	{
		//get audio element
		var audio = $(this);
		//create container
		var container = $('<div class="audio-player-container"></div>');
		//create div element
		var player = $('<div class="audio-player"></div>');
		//create bars
		var bars = $
		(
			'<div class="audio-bars">' +
				'<div class="audio-bar"></div>' +
				'<div class="audio-bar"></div>' +
				'<div class="audio-bar"></div>' +
				'<div class="audio-bar"></div>' +
				'<div class="audio-bar"></div>' +
				'<div class="audio-bar"></div>' +
				'<div class="audio-bar"></div>' +
				'<div class="audio-bar"></div>' +
				'<div class="audio-bar"></div>' +
				'<div class="audio-bar"></div>' +
			'</div>'
		);
		
		//remove audio player class from audio tag
		audio.removeClass('audio-player');
		
		//insert player in container
		container.append(player);
		//insert container element
		container.insertAfter(audio);
		
		//add audio bars
		player.append(bars);
		
		//on audio play
		audio[0].onplay = function()
		{
			player.addClass('on').removeClass('off');
		};
		
		//on audio pause
		audio[0].onpause = function()
		{
			player.addClass('off').removeClass('on');
		};
		
		//on audio player click
		bars.on('click', function()
		{
			if (audio[0].paused == false)
			{
				audio[0].pause();
			}
			else
			{
				audio[0].play();
			}
		});
		
		//set player status
		if(audio[0].paused == false)
		{
			player.addClass('on').removeClass('off');
		}
		else
		{
			player.addClass('off').removeClass('on');
		}
	});
	
	//ajax forms
	$('.ajax-form').on('submit', function(e)
	{
		//get current form
		var $form = $(this);
		//get method
		var method = $form.attr('method').toUpperCase();
		//get action
		var action = $form.attr('action');
		//send ajax request
		$.ajax(
		{
			type: method,
			url: action,
			data: $form.serialize(),
			success: function(data)
			{
				if(data.indexOf('alert-success') > 0)
				{
					$form.trigger('reset');
				}
			
				if($form.is('[data-result]'))
				{
					$($form.data('result')).html(data);
				}
			}
		});
		
		e.preventDefault();
	});
	
	//snow text
	$(window).on('resize', function()
	{
		$('.snow-text').each(function()
		{
			//get element
			var $this = $(this);
			//get text
			var text = $this.text();
			//get chars count
			var chars = text.length;
			//check for portrait/landscape mode
			if($(window).width() > $(window).height())
			{
				//calculate font size
				var font_size = Math.min(16, 200 / chars);
				//set font size
				$this.css('font-size', font_size + 'vh');
			}
			else
			{
				//calculate font size
				var font_size = Math.min(15, 160 / chars);
				//set font size
				$this.css('font-size', font_size + 'vw');
			}
		});
		
	}).trigger('resize');
	
});

		var musicCurrentTime = 0;
		var musicCurrentLine = 0;

		var musicLyric = "[00:00.000]牛奶咖啡 - 明天，你好\n[00:01.000]作曲 : 王海涛\n[00:03.000]作词 : 牛奶咖啡\n[00:05.000]‘间奏’\n[00:23.080]看昨天的我们 走远了\n[00:28.030]在命运广场中央 等待\n[00:33.470]那模糊的 肩膀\n[00:36.310]越奔跑 越渺小\n[00:43.130]曾经 并肩往前的 伙伴\n[00:48.090]在举杯祝福后都 走散\n[00:53.500]只是那个 夜晚\n[00:56.300]我深深 的都留藏在心坎\n[01:00.710]长大以后 我只能奔跑\n[01:05.660]我多害怕 黑暗中跌倒\n[01:10.590]明天你好 含着泪微笑\n[01:15.930]越美好 越害怕得到\n[01:20.610]每一次哭 又笑着奔跑\n[01:25.630]一边失去 一边在寻找\n[01:30.500]明天你好 声音多渺小\n[01:35.570]却提醒我 勇敢是什么\n[02:03.130]当我朝着反方向走去\n[02:07.990]在楼梯的角落 找勇气\n[02:13.450]抖着肩膀 哭泣\n[02:16.260]问自己 在哪里\n[02:23.070]曾经 并肩往前 的伙伴\n[02:28.050]沉默着 懂得我的委屈\n[02:33.480]时间它总说谎\n[02:36.230]我从 不曾失去 那些肩膀\n[02:40.580]长大以后 我只能奔跑\n[02:45.510]我多害怕 黑暗中跌倒\n[02:50.480]明天你好 含着泪微笑\n[02:56.080]越美好 越害怕得到\n[03:00.530]每一次哭 又笑着奔跑\n[03:05.520]一边失去 一边在寻找\n[03:10.490]明天你好 声音多渺小\n[03:15.660]却提醒我\n[03:20.620]长大以后 我只能奔跑\n[03:25.590]我多害怕 黑暗中跌倒\n[03:30.590]明天你好 含着泪微笑\n[03:36.010]越美好 越害怕得到\n[03:40.380]每一次哭 又笑着奔跑\n[03:45.560]一边失去 一边在寻找\n[03:50.520]明天你好 声音多渺小\n[03:55.570]却提醒我\n[04:00.380]勇敢是什么";
		var musicLyricLine = new Array();
		musicLyricLine = musicLyric.split("\n");
		var musicLyricContent = new Array();
		for(var i = 0; i < musicLyricLine.length; i++)
		{
			var musicLyricTemp = new Array();
			musicLyricTemp = musicLyricLine[i].split("]");
			musicLyricTemp[0] = musicLyricTemp[0].substr(1, musicLyricTemp[0].length - 1);
			var musicLyricTempMinute = musicLyricTemp[0].split(":")[0];
			var musicLyricTempSecond = musicLyricTemp[0].split(":")[1].split(".")[0];
			var musicLyricTempMillisecond = musicLyricTemp[0].split(":")[1].split(".")[1];
			var musicLyricTempText = musicLyricTemp[1];
			var musicLyricTempTimeline = parseInt(musicLyricTempMillisecond) + parseInt(musicLyricTempSecond) * 1000 + parseInt(musicLyricTempMinute) * 1000 * 60;
			musicLyricContent[i] = new Array();
			musicLyricContent[i][0] = musicLyricTempTimeline;
			musicLyricContent[i][1] = musicLyricTempText;
		}

		var musicLyricId = document.getElementById("subtitle");
		musicLyricId.innerHTML = "歌词载入ing";
		var musicPlayerId = document.getElementById("audio");
		musicPlayerId.onload=setInterval(
			function()
			{
				musicCurrentTime = audio.currentTime * 1000;
				//console.log(audio.currentTime * 1000);
			}, 50);
		musicPlayerId.onchange=function(){console.log(123)}
		var musicOpacity = 1;

		setTimeout(function(){musicShow()},10);

		function musicShow(){
			var musicCurrentLineTemp = musicCurrentLine;
			for(var i = 0; i < musicLyricContent.length; i++)
			{
				if(musicLyricContent[i][0] > musicCurrentTime)
				{
					musicCurrentLine = i - 1;
					if(musicCurrentLine != musicCurrentLineTemp)musicOpacity = 0;
					break;
				}else if(i == musicLyricContent.length - 1)
				{
					musicCurrentLine = musicLyricContent.length - 1;
				}
			}
			if(musicCurrentLine < 0)
				musicLyricId.innerHTML = "歌词载入ing";
			else
				musicLyricId.innerHTML = musicLyricContent[musicCurrentLine][1];
			musicLyricId.style.color = "#F9F4DC";
			if(musicOpacity < 1){
				musicOpacity += 0.01;
				setTimeout(function(){musicShow()},10);
			}else{
				setTimeout(function(){musicHide()},800);
			}
		}

		function musicHide(){
			var musicCurrentLineTemp;
			for(var i = 0; i < musicLyricContent.length; i++)
			{
				if(musicLyricContent[i][0] > musicCurrentTime)
				{
					musicCurrentLineTemp = i - 1;
					if(musicCurrentLineTemp != musicCurrentLineTemp)musicOpacity = 0;
					break;
				}else if(i == musicLyricContent.length - 1)
				{
					musicCurrentLineTemp = musicLyricContent.length - 1;
				}
			}
			if(musicCurrentLine != musicCurrentLineTemp)
			{
				setTimeout(function(){musicShow()},10);
				return 0;
			}
			if(musicCurrentTime < parseInt(musicLyricContent[musicCurrentLine + 1][0])){
				setTimeout(function(){musicHide()},10);
				return 0;
			}
			musicLyricId.style.color = "rgba(0,0,0," + musicOpacity +")";
			musicOpacity -= 0.018;
			if(musicOpacity > 0){
				setTimeout(function(){musicHide()},10);
			}else{
				musicShow();
			}
		};
// 设置结束时间的时间戳
var endTime = new Date("2024/06/05 09:00:00").getTime();

// 弹窗提示
function showPopup() {
  var overlay = document.createElement('div');
  overlay.className = 'popup-overlay show-popup';
  document.body.appendChild(overlay);

  var popup = document.createElement('div');
  popup.className = 'popup-content';
  popup.innerText = '各位考生高考在即，愿你们以最饱满的热情、最坚定的信心、最冷静的头脑 \n 迎接这场人生的重要考验，每一科都能发挥出最好的水平，每一分都凝聚着你们过去无数个日夜的辛勤付出和汗水，\n愿你们在考场上如鱼得水、游刃有余，最终金榜题名，\n梦想成真，书写出属于自己的辉煌篇章，开启人生新的辉煌旅程！\n加油，你们一定可以的！ ';
  document.body.appendChild(popup);

  // 5秒后跳转
  setTimeout(function() {
    window.location.href = "https://xiaoyuban1213.github.io/gk2025/";
    document.body.removeChild(overlay);
    document.body.removeChild(popup);
  }, 5000);
} 

// 设置定时器
var timer = setInterval(function() {
  // 获取当前时间的时间戳
  var nowTime = new Date().getTime();
  // 计算剩余的时间（毫秒）
  var leftTime = endTime - nowTime;
  // 计算剩余的秒数
  var seconds = Math.floor(leftTime / 1000);
  // 判断倒计时是否结束
  if(seconds <= 0) {
    clearInterval(timer);
    showPopup(); // 显示弹窗
  }
}, 1000);