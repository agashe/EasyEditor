/**
 *EasyEditor v2.0.0
 *
 *@author Mohamed Yousef <engineer.mohamed.yossef@gmail.com>
 *@license MIT
 *@copyright 2020 AGASHE
 */

/**
 *Note:Make sure that you included these files inside your html file:
 *- jquery library <v1.10.0 or later>
 *- easyeditor.min.css or EasyEditor.css
 *- easyeditor.min.js or EasyEditor.js
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
		/*EasyEditor is using icons from css.gg<https://css.gg | https://github.com/astrit/css.gg> */
		var icons = ['format-left', 'format-center', 'format-right', 'format-color',
					 'format-bold', 'format-italic', 'format-underline', 'layout-list',
					 'link', 'image', 'code-slash', 'quote-o', 'smile-mouth-open', 'info'];
		$('head').append("<link href='https://css.gg/css?=" + icons.join('|') + "' rel='stylesheet'>");
		
		/*Define frame's IDs.*/
		var ee_text_id  = 'ee-t-'+ee_textbox.attr("id");
		var ee_frame_id = 'ee-f-'+ee_textbox.attr("id");

		/*Define frame body.*/
		var ee_frame_body = "<div class='ee-frame' id='"+ee_frame_id+"'><ul>";
			
			ee_frame_body += "<li title='Bold' id='ee-bold' class='no-right-padding'><i class='gg-format-bold'></i></li>";	
			ee_frame_body += "<li title='Italic' id='ee-italic' class='no-right-padding'><i class='gg-format-italic'></i></li>";	
			ee_frame_body += "<li title='Underline' id='ee-underline' class='right-space'><i class='gg-format-underline'></i></li>";			
			
			ee_frame_body += "<li title='Align Left' id='ee-left' class='adjust-button'><i class='gg-format-left'></i></li>";	
			ee_frame_body += "<li title='Align Center' id='ee-center' class='adjust-button'><i class='gg-format-center'></i></li>";	
			ee_frame_body += "<li title='Align Right' id='ee-right' class='right-space adjust-button'><i class='gg-format-right'></i></li>";

			ee_frame_body += "<li title='Font' id='ee-font' class='right-space adjust-font-button'><i class='gg-format-color'></i></li>";	

			ee_frame_body += "<li title='Link' id='ee-link' class='adjust-font-button'><i class='gg-link'></i></li>";	
			ee_frame_body += "<li title='Image' id='ee-image' class='small-right-space top-space'><i class='gg-image'></i></li>";	
			ee_frame_body += "<li title='List Item' id='ee-list' class='right-space adjust-font-button'><i class='gg-layout-list'></i></li>";
			
			ee_frame_body += "<li title='Code' id='ee-code' class='no-right-padding'><i class='gg-code-slash'></i></li>";	
			ee_frame_body += "<li title='Quote' id='ee-quote' class='top-space'><i class='gg-quote-o'></i></li>";	
			ee_frame_body += "<li title='Emoji' id='ee-emoji' class='no-top-space'><i class='gg-smile-mouth-open'></i></li>";
			
			ee_frame_body += "<li title='About' id='ee-about' class='no-top-space about-button'><i class='gg-info'></i></li>";

			ee_frame_body += "</ul></div>";
			ee_frame_body += "<div class='ee-preview' id='"+ee_text_id+"' title='Preview Window'></div>";

		/*Validate the textarea height and width.*/
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
		$(ee_container).html('').html(content);
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

		/*Get the selected text and it's position.*/
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
		$(document).on('click',  ee_frame + ' button#ee-font-ok', (function() {
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_font(ee_selected_text, ee_start, ee_end, ee_textbox, $("#ee-font-family").val(), $("#ee-font-color").val(), $("#ee-font-size").val());
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		}));

		//link.
		$(ee_frame + " #ee-link").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_link(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});

		//image.
		$(ee_frame + " #ee-image").click(function(){
			ee_image(ee_textbox[0].selectionStart, ee_textbox);
			ee_refresh(ee_preview_panel, ee_textbox.val());
		});

		//list.
		$(ee_frame + " #ee-list").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_list(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});

		//code.
		$(ee_frame + " #ee-code").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_code(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});
		
		//quote.
		$(ee_frame + " #ee-quote").click(function(){
			if (ee_selected_text != "" && ee_selected_text != null) {
				ee_quote(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_refresh(ee_preview_panel, ee_textbox.val());
				ee_selected_text = "";
			}
		});
		
		//emoji.
		$(ee_frame + " #ee-emoji").click(function(){
			ee_emoji(ee_textbox[0].selectionStart, ee_textbox);
			ee_refresh(ee_preview_panel, ee_textbox.val());
		});
		
		//about.
		$(ee_frame + " #ee-about").click(function(){
			window.open('https://github.com/agashe/EasyEditor', '_blank');
		});
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
		var pattern = "<span style='font-family:"+
			family.toLowerCase()+";color:"+color.toLowerCase()+
			";font-size:"+size.toLowerCase()+
			";'>" + text + "</span>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	
	function ee_link(text, start, end, ee_textbox){
		var pattern = '<a href="http://">' + text + "</a>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}

	function ee_image(start, ee_textbox){
		var pattern = '<img src="http://" height="100" width="100" alt="" />';
		ee_textbox.val(ee_textbox.val().substring(0, start) + pattern + ee_textbox.val().substring(start));
	}

	function ee_list(text, start, end, ee_textbox){
		var pattern = '<ul>\n<li>' + text + "</li>\n</ul>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	
	function ee_code(text, start, end, ee_textbox){
		var pattern = '<code>' + text + "</code>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	
	function ee_quote(text, start, end, ee_textbox){
		var pattern = '<q>' + text + "</q>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}

	function ee_emoji(start, ee_textbox){
		var pattern = '&#128515;';
		ee_textbox.val(ee_textbox.val().substring(0, start) + pattern + ee_textbox.val().substring(start));
	}

	 /*==-Main Function-==*/
	$.fn.EasyEditor = function(){
		ee_init(this);
		ee_event_handler(this);
		return this;
	};
}(jQuery));