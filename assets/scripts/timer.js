$(function(){

	// init
	$('#countdown').addTimer();
		
	$('#run').click(function(){
		$.countUpTimer.run();
	});

	$('#pause').click(function(){
		$.countUpTimer.pause();
	});

	$('#reset').click(function(){
		$.countUpTimer.reset();
	});

	$('#set').click(function(){
		$.countUpTimer.set();
	});
	
});
