/**
 *EasyEditor v2.0.0
 *
 *@author Mohamed Yousef <engineer.mohamed.yossef@gmail.com>
 *@license MIT
 *@copyright 2020 AGASHE
 */

/**
 *Note:Make sure that you included these files inside your html file:
 *-jquery library <v1.10.0 or later>
 *-easyeditor.css
 */

(function(){
	/*==-Proccessing functions-==*/
	
	/**
	 *Inintialize the Textarea.
	 *
	 *Add Div and list of buttons.
	 *Generate id for the frame(div).
	 *Set the width and hight of the frame.
	 *
	 *The generated id is used to allow the user to use the plugin
	 *with meny textarea, and to prevent conflict between them.
	 */
	function ee_init(ee_textbox){
		/*Add the required icons*/
		/*EasyEditor use icons from css.gg<https://css.gg | https://github.com/astrit/css.gg> */
		$('head').append("<link href='https://css.gg/css?=format-left|format-center|format-right|format-color|format-bold|format-italic|format-underline' rel='stylesheet'>");
		
		/*Define ftrame id. or class!*/
		var ee_text_id  = 'ee-t-'+ee_textbox.attr("id");
		var ee_frame_id = 'ee-f-'+ee_textbox.attr("id");

		/*Define frame body.*/
		var ee_frame_body = "<div class='ee-frame' id='"+ee_frame_id+"'><ul>";
			
			ee_frame_body += "<li title='Bold' id='ee-bold'><i class='gg-format-bold'></i></li>";	
			ee_frame_body += "<li title='Italic' id='ee-italic'><i class='gg-format-italic'></i></li>";	
			ee_frame_body += "<li title='Underline' id='ee-underline' class='right-space'><i class='gg-format-underline'></i></li>";			
			
			ee_frame_body += "<li title='Align left' id='ee-left' class='adjust-button'><i class='gg-format-left'></i></li>";	
			ee_frame_body += "<li title='Align center ' id='ee-center' class='adjust-button'><i class='gg-format-center'></i></li>";	
			ee_frame_body += "<li title='Align right' id='ee-right' class='right-space adjust-button'><i class='gg-format-right'></i></li>";

			ee_frame_body += "<li title='Font' id='ee-font' class='adjust-font-button'><i class='gg-format-color'></i></li>";	

			ee_frame_body += "</ul></div>";

			ee_frame_body += "<div class='ee-preview' id='"+ee_text_id+"' title='Preview Window'></div>";

		/*Validate the textarea height and width*/
		if (ee_textbox.height() < 300)
			ee_textbox.height(300);
		
			if (ee_textbox.width() < 500)
			ee_textbox.width(500);
		
		/*Add the frame to textarea.*/
		ee_textbox.addClass('ee-textbox');
		ee_textbox.before(ee_frame_body);
		$('#'+ee_frame_id).width(ee_textbox.width());
		$('#'+ee_text_id).width(ee_textbox.width());
		$('#'+ee_text_id).height((ee_textbox.height() / 2));
		ee_textbox.height((ee_textbox.height() / 2));
	}
	
	/**
	 *Text replacement for specific range.
	 *
	 *Source: https://stackoverflow.com/questions/14880229
	 */
	String.prototype.replaceBetween = function(start, end, what) {
		return this.substring(0, start) + what + this.substring(end);
	};
	
	/**
	 *Add font panel, to modify : font family, color and size.
	 */
	function ee_font_panel(ee_button){
		//different font properties
		var fonts  = ['Tahoma', 'Calibri', 'Times New Roman', 'Arial', 'Aharoni',
			'Bodoni MT', 'Dotum', 'MS Outlook', 'Consolas', 'Gill Sans MT',
			'Vladimir Script', 'Gigi', 'Elephant', 'Fira Code', 'Magneto'];
		var colors = ['Black', 'Red', 'Blue', 
			'Green', 'Yellow', 'Orange', 
			'Brown', 'Pink', 'Gray', 
			'SkyBlue', 'LimeGreen', 'SlateGray'];
		var sizes  = [10, 11, 12, 14, 16, 18, 22, 24, 28, 32, 40, 60];
		
		var fpanel_fonts  = '';
		var fpanel_colors = '';
		var fpanel_sizes  = '';
		
		fonts.forEach(function(font){
			fpanel_fonts = fpanel_fonts + "<option>" + font + "</option>";
		});
		colors.forEach(function(color){
			fpanel_colors = fpanel_colors + "<option>" + color + "</option>";
		});
		sizes.forEach(function(size){
			fpanel_sizes = fpanel_sizes + "<option>" + size + "pt</option>";
		});

		/*Define font panel body.*/
		var ee_fpanel_body = "\
			<div class='ee-fpanel'>\
				<select id='ee-font-family' title='Font Family'>\
					" + fpanel_fonts + "\
				</select>\
				<select id='ee-font-size' title='Font Size'>\
					" + fpanel_sizes + "\
				</select>\
				<select id='ee-font-color' title='Font Color'>\
					" + fpanel_colors + "\
				</select>\
				<button id='ee-font-ok'>Apply</button>\
			</div>\
		";

		$(ee_button).after(ee_fpanel_body);
	}

	/**
	 *Refresh the preview panel.
	 */
	function ee_refresh(ee_container, content){
		$(ee_container).html('');
		$(ee_container).html(content);
	}
	
	/**
	 *Handle user input, take actions.
	 */
	function ee_event_handler(ee_textbox){
		var ee_start, ee_end;
		var ee_selected_text = "";
		var ee_frame = '#ee-f-'+ee_textbox.attr("id");
		var ee_preview_panel  = '#ee-t-'+ee_textbox.attr("id");
		
		/*Update the preview window and its scroll!!*/
		$(document).ready(function(){
			if (ee_textbox.val() != '') {
				ee_refresh(ee_preview_panel, ee_textbox.val());
			}
		});

		$(ee_textbox).keyup(function(e){
			ee_refresh(ee_preview_panel, ee_textbox.val());
			
			if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
				$(ee_preview_panel).scrollTop(1000000);
			}
		});

		$(ee_textbox).scroll(function () {
			if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
				$(ee_preview_panel).scrollTop(1000000);
			} else {
				$(ee_preview_panel).scrollTop($(this).scrollTop());
			}
		});

		/*Get the highlighted text and it's position.*/
		$(ee_textbox).select(function(){
			ee_start = this.selectionStart;
			ee_end = this.selectionEnd;
			ee_selected_text = this.value.substring(ee_start, ee_end);
		});
		
		//bold, italic and underline.
		$(ee_frame + " #ee-bold").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_bold(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});
		$(ee_frame + " #ee-italic").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_italic(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});
		$(ee_frame + " #ee-underline").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_underline(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});
		
		//text alignment.
		$(ee_frame + " #ee-left").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_align(ee_selected_text, ee_start, ee_end, ee_textbox, "left");
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});
		$(ee_frame + " #ee-center").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_align(ee_selected_text, ee_start, ee_end, ee_textbox, "center");
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});
		$(ee_frame + " #ee-right").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_align(ee_selected_text, ee_start, ee_end, ee_textbox, "right");
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});
		
		//font.
		$(ee_frame + " #ee-font").click(function(){
			if ( $(".ee-fpanel").length > 0) {
				$(".ee-fpanel").remove();
			}else{
				ee_font_panel(this);
			}
		});
		$(ee_textbox).click(function(){
			$(".ee-fpanel").remove();
		});
		$(ee_preview_panel).click(function(){
			$(".ee-fpanel").remove();
		});
		
		//because we can't access new elements with just click
		$(document).on('click',  'button#ee-font-ok', (function() {
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_font(ee_selected_text, ee_start, ee_end, ee_textbox, $("#ee-font-family").val(), $("#ee-font-color").val(), $("#ee-font-size").val());
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		}));
	}
		
	/*==-Effects!-==*/
	function ee_bold(text, start, end, ee_textbox){
		var pattern = "<b>" + text + "</b>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	
	function ee_italic(text, start, end, ee_textbox){
		var pattern = "<i>" + text + "</i>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	function ee_underline(text, start, end, ee_textbox){
		var pattern = "<u>" + text + "</u>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	
	function ee_align(text, start, end, ee_textbox, direction){
		var pattern = "";
		switch (direction) {
			case "left":
				var pattern = "<p style='text-align:left;'>" + text + "</p>";
			break;
			case "center":
				var pattern = "<p style='text-align:center;'>" + text + "</p>";
			break;
			case "right":
				var pattern = "<p style='text-align:right;'>" + text + "</p>";
			break;
		}
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	
	function ee_font(text, start, end, ee_textbox, family, color, size){
		var pattern = "<span style='font-family:"+family.toLowerCase()+";color:"+color.toLowerCase()+";font-size:"+size.toLowerCase()+";'>" + text + "</span>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	
	/**
	 *ToDo:
	 *function ee_list(){}
	 *function ee_link(){}
	 *function ee_quote(){}
	 *function ee_image(){}
	 *function ee_code(){}
	 *function ee_emoji(){}
	 */

	 /*==-Main Function-==*/
	$.fn.EasyEditor = function(){
		ee_init(this);
		ee_event_handler(this);
		return this;
	};
}(jQuery));