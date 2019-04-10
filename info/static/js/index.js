/**
 * Created by python on 19-4-10.
 */
jQuery.fn.neonText = function(options){
  var options = jQuery.extend({
		textColor: '#DCDCDC',
		textSize: '22px',
		neonHighlight: 'white',
		neonHighlightColor: '#FD91F7',
		neonHighlightHover: '#FFC2FB',
		neonFontHover: '#FFFFFF'
	},options)
	return this.each(function() {
		jQuery(this).css('color', options.textColor)
			.css('font-size', options.textSize)
			.css('text-shadow','0 0 10px '+options.neonHighlight+',0 0 20px '+options.neonHighlight+',0 0 30px '+options.neonHighlight +',0 0 40px '+options.neonHighlightColor+',0 0 70px '+options.neonHighlightColor+',0 0 80px '+options.neonHighlightColor+',0 0 100px '+options.neonHighlightColor)
			.hover(
				function () {
					jQuery(this)
						.css('text-shadow','0 0 10px '+options.neonHighlight+',0 0 20px '+options.neonHighlight+',0 0 30px '+options.neonHighlight+',0 0 40px '+options.neonHighlightHover+',0 0 70px '+options.neonHighlightHover+',0 0 80px '+options.neonHighlightHover+',0 0 100px '+options.neonHighlightHover)
						.css('color', options.neonFontHover);
				},
				function () {
					jQuery(this)
						.css('color', options.textColor)
						.css('text-shadow','0 0 10px ' +options.neonHighlight + ',0 0 20px ' +options.neonHighlight + ',0 0 30px ' +options.neonHighlightColor + ',0 0 40px ' +options.neonHighlightColor +  ',0 0 70px ' +options.neonHighlightColor +  ',0 0 80px ' +options.neonHighlightColor + ',0 0 100px ' +options.neonHighlightColor)
				}
			);
	});
};


 $(function () {
     var $chat = $('#chat')
     var $luntan = $('#luntan')
     var $wait = $('#wait')
     var $message = $('#message')
     var $version_info = $('.version_info')
     var $chat_info = $('.chat_info')
     var $luntan_info = $('.luntan_info')
     var $wait_work = $('.wait_work')
     var $message_board = $('.message_board')

     $chat.neonText()
     $luntan.neonText()
     $wait.neonText()
     $message.neonText()

     $chat.hover(function () {
         $version_info.hide()
         $chat_info.fadeIn()
     })
     $chat.mouseleave(function () {
         $version_info.fadeIn()
         $chat_info.hide()
     })

     $luntan.hover(function () {
         $version_info.hide()
         $luntan_info.fadeIn()
     })
     $luntan.mouseleave(function () {
         $version_info.fadeIn()
         $luntan_info.hide()
     })

     $wait.hover(function () {
         $version_info.hide()
         $wait_work.fadeIn()
     })
     $wait.mouseleave(function () {
         $version_info.fadeIn()
         $wait_work.hide()
     })

     $message.hover(function () {
         $version_info.hide()
         $message_board.fadeIn()
     })
     $message.mouseleave(function () {
         $version_info.fadeIn()
         $message_board.hide()
     })

 })