/**
 * @name    jQuery Count-UP Plugin
 * @author    Martin Angelov
 * @version   1.0
 * @url      http://tutorialzine.com/2012/09/count-up-jquery/
 * @license    MIT License
 */

jQuery(function($){
  
  // Number of seconds in every time division
  var hours  = 60*60, minutes  = 60;

  // Creating the plugin
  $.fn.addTimer = function(prop){  // Initialize the plugin
    init(this, {start: new Date()});  // adds to html
    var positions = this.find('.position'),
        passed = 0, h = 0, m = 0, s = 0;

    $interval = null;
    var interval_ms = 1000, t_start = 0;

    /** Initialize Plugin
     */
    function init(elem, options){
      elem.addClass('countdownHolder');

      // Creating the markup inside the container
      $.each(['Hours','Minutes','Seconds'],function(i){
        $('<span class="count'+this+'">').html(
          '<span class="position">\
            <span class="digit static">0</span>\
          </span>\
          <span class="position">\
            <span class="digit static">0</span>\
          </span>'
        ).appendTo(elem);
        
        if(this!="Seconds"){
          elem.append('<span class="countDiv countDiv'+i+'"></span>');
        }
      });
    }
    
    /** Updates two digit positions at once
     */
    function updateDuo(minor,major,value){
      this.switchDigit(this.positions.eq(minor),Math.floor(value/10)%10);
      this.switchDigit(this.positions.eq(major),value%10);
    }

    /** Set the time via 'prompt' window
     */
    function set() {
      var input = prompt("Enter zulu time, 6 digits");
      if(input && input.length == 6) {
        // $.countUpTimer.reset();
        $.countUpTimer.t_start = new Date(null,null,null,input.substr(0,2), input.substr(2,2), input.substr(4,2));
        $.countUpTimer.updateDisplay([[input[0],input[1]], [input[2],input[3]], [input[4],input[5]]]);

        // update 'passed' value
        var hrs = parseInt(input.substr(0,2))*hours;
        var min = parseInt(input.substr(2,2))*minutes;
        var sec = parseInt(input.substr(4,2));
        $.countUpTimer.passed = hrs + min + sec;
      }

    }

    /** Starts the timer
     */
    function run() {
      $.countUpTimer.interval_ms = interval_ms;
      if(!$.countUpTimer.running) $interval = setInterval(
            $.countUpTimer.tick, $.countUpTimer.interval_ms);  // schedule ticks every interval
    }

    function pause() {
      clearInterval($interval);
      $.countUpTimer.running = false;
    }
    
    /** Increments the timer
     */
    function tick(){
      $.countUpTimer.running = true;

      // Proceed to next interval (aka 'tick' forward)
      $.countUpTimer.passed += $.countUpTimer.interval_ms/1000;

      var t = $.countUpTimer.passed;
      
      // Number of hours left
      $.countUpTimer.h = Math.floor(t / hours);
      t -= $.countUpTimer.h*hours;
      
      // Number of minutes left
      $.countUpTimer.m = Math.floor(t / minutes);
      t -= $.countUpTimer.m*minutes;
      
      // Number of seconds left
      $.countUpTimer.s = t;

      // Update clock
      $.countUpTimer.updateDisplay([
        [Math.floor($.countUpTimer.h/10), $.countUpTimer.h%10],
        [Math.floor($.countUpTimer.m/10), $.countUpTimer.m%10],
        [Math.floor($.countUpTimer.s/10), $.countUpTimer.s%10]]);
    }

    /** Reset timer to 00:00:00
     */
    function reset() {
      clearInterval($interval);
      $.countUpTimer.running = false;
      $.countUpTimer.passed = 0;
      updateDisplay([[0,0],[0,0],[0,0]]);
    }

    function updateDisplay(data) {
      if(parseInt($.map(data,function(a){return a.join('');}).join('')) >= 240000) {  // at/above 24:00:00
        $.countUpTimer.passed = 0;
        data = [[0,0],[0,0],[0,0]];
      }
      $.countUpTimer.switchDigit($.countUpTimer.positions.eq(0),data[0][0]);
      $.countUpTimer.switchDigit($.countUpTimer.positions.eq(1),data[0][1]);
      $.countUpTimer.switchDigit($.countUpTimer.positions.eq(2),data[1][0]);
      $.countUpTimer.switchDigit($.countUpTimer.positions.eq(3),data[1][1]);
      $.countUpTimer.switchDigit($.countUpTimer.positions.eq(4),data[2][0]);
      $.countUpTimer.switchDigit($.countUpTimer.positions.eq(5),data[2][1]);
    }

    /** Creates an animated transition between the two numbers
     */
    function switchDigit(position,number){
      var digit = position.find('.digit')
      if(digit.is(':animated'))  return false;
      if(position.data('digit') == number) return false; // We are already showing this number
      position.data('digit', number);
      
      var replacement = $('<span>', {'class':'digit',  css:{top:'-1em', opacity:0}, html:number});
      
      // The .static class is added when the animation
      // completes. This makes it run smoother.
      
      digit
        .before(replacement)
        .removeClass('static')
        .animate({top:'1em',opacity:0},'fast',function(){
          digit.remove();
        })

      replacement
        .animate({top:0,opacity:1},'fast',function(){
          replacement.addClass('static');
        });
    }

    $.countUpTimer = {t_start:t_start, positions:positions, passed:passed, init:init, run:run, tick:tick, pause:pause, reset:reset, set:set, updateDuo:updateDuo, switchDigit:switchDigit, running:false, updateDisplay:updateDisplay, h:h, m:m, s:s};
  };
});