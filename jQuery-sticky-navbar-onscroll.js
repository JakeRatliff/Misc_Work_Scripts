/* Sticky navbar when it reaches top */
/* Requires jQuery */
$(document).ready(function() {
  var navDistFromTop = $("#site-navigation").offset().top;
  var navHeight = $("#site-navigation").outerHeight(true);
  var contentTopMargin = $("#content").css("margin-top");
  var newTopMargin = parseFloat(contentTopMargin) + navHeight;
	console.log(newTopMargin)
  $(window).scroll(function () {
      //if you hard code, then use console
      //.log to determine when you want the 
      //nav bar to stick.  
    if ($(window).scrollTop() > navDistFromTop) {
      $('#site-navigation').addClass('navbar-fixed');
	  $('#content').css("margin-top", newTopMargin);
    }
    if ($(window).scrollTop() < navDistFromTop) {
      $('#site-navigation').removeClass('navbar-fixed');
	  $('#content').css("margin-top", contentTopMargin)
    }
  });
});
