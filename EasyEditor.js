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
	 *Set the width of the frame.
	 *
	 *The generated id is used to allow the user to use the plugin
	 *with meny textarea, and to prevent conflict between them.
	 */
	function ee_init(ee_textbox){
		/*Define ftrame id. or class!*/
		var ee_text_id  = 'ee-t-'+ee_textbox.attr("id");
		var ee_frame_id = 'ee-f-'+ee_textbox.attr("id");

		/*Define frame body.*/
		var ee_frame_body = "<div class='ee-frame' id='"+ee_frame_id+"'><ul>";
			
			ee_frame_body += "<li title='Bold' id='ee-bold'>B</li>";	
			ee_frame_body += "<li title='Italic' id='ee-italic'>I</li>";	
			ee_frame_body += "<li title='Underline' id='ee-underline' style='margin-right:10px;'>U</li>";			
			
			ee_frame_body += "<li title='Align left' id='ee-left'>L</li>";	
			ee_frame_body += "<li title='Align center ' id='ee-center'>C</li>";	
			ee_frame_body += "<li title='Align right' id='ee-right' style='margin-right:10px;'>R</li>";

			ee_frame_body += "<li title='Font' id='ee-font'>A</li>";	

			ee_frame_body += "</ul></div>";

			ee_frame_body += "<div class='ee-textbox' id='"+ee_text_id+"' contenteditable='true'></div>";

		/*Add the frame to textarea.*/
		ee_textbox.before(ee_frame_body);
		$('#'+ee_frame_id).width(ee_textbox.width());
		$('#'+ee_text_id).width(ee_textbox.width());
		$('#'+ee_text_id).height(ee_textbox.height());
		ee_textbox.css('display', 'none');
	}
	
	/**
	 *Get selected text.
	 *
	 *Becuase each browser handles the selection of text by diffferent 
	 *way, each way was set to make the plugin compitable with all major
	 *brwosers.
	 */
	function ee_get_text(ee_textbox){
		/**
		 *ToDo: Add suitable code for each browser.
		 */
		 
		/*Hold text properties.*/
		var prop = [];
		
		prop["text_start"] = ee_textbox.selectionStart;
		prop["text_end"] = ee_textbox.selectionEnd;
		prop["text_value"] = ee_textbox.value.substring(ee_textbox.selectionStart, ee_textbox.selectionEnd);
		
		return prop;
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
		/*Define font panel body.*/
		var ee_fpanel_body = "<div class='ee-fpanel'><ul>";
			
			ee_fpanel_body += "<li><select id='ee-font-family' title='Font Family'><option>Tahoma</option><option>Gigi</option></select></li>";	
			ee_fpanel_body += "<li><select id='ee-font-size' title='Font Size'><option>10</option><option>12</option><option>14</option></select></li>";	
			ee_fpanel_body += "<li><select id='ee-font-color' title='Font Color'><option>black</option><option>blue</option><option>red</option></select></li>";			
			ee_fpanel_body += "<li><button id='ee-font-ok'>ok</button></li>";						
			
			ee_fpanel_body += "</ul></div>";

		$(ee_button).after(ee_fpanel_body);
	}
	
	/**
	 *Handle user input, take actions.
	 */
	function ee_event_handler(ee_textbox){
		/**
		 *Hold the Selected text properties,
		 *text start and end positions.
		 */
		var prop = [];
		var ee_selected_text = "";
		var ee_start, ee_end;
		
		// update the textarea value
		$(document).on('keyup', '.ee-textbox', function(){
			$(ee_textbox).html($(this).html());
		});

		/*Get the highlighted text and it's position.*/
		$(ee_textbox).select(function(){
			prop = ee_get_text(this);
			ee_selected_text = prop["text_value"];
			ee_start = prop["text_start"];
			ee_end = prop["text_end"];
		});
		
		//bold, italic and underline.
		$("#ee-bold").click(function(){
			if(ee_selected_text != "" && ee_selected_text != null){
				ee_bold(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_selected_text = "";
			}
		});
		$("#ee-italic").click(function(){
			if(ee_selected_text != "" && ee_selected_text != null){
				ee_italic(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_selected_text = "";
			}
		});
		$("#ee-underline").click(function(){
			if(ee_selected_text != "" && ee_selected_text != null){
				ee_underline(ee_selected_text, ee_start, ee_end, ee_textbox);
				ee_selected_text = "";
			}
		});
		
		//font alignment.
		$("#ee-left").click(function(){
			if(ee_selected_text != "" && ee_selected_text != null){
				ee_align(ee_selected_text, ee_start, ee_end, ee_textbox, "left");
				ee_selected_text = "";
			}
		});
		$("#ee-center").click(function(){
			if(ee_selected_text != "" && ee_selected_text != null){
				ee_align(ee_selected_text, ee_start, ee_end, ee_textbox, "center");
				ee_selected_text = "";
			}
		});
		$("#ee-right").click(function(){
			if(ee_selected_text != "" && ee_selected_text != null){
				ee_align(ee_selected_text, ee_start, ee_end, ee_textbox, "right");
				ee_selected_text = "";
			}
		});
		
		//font.
		$("#ee-font").click(function(){
			if( $(".ee-fpanel").length > 0){
				$(".ee-fpanel").remove();
			}else{
				ee_font_panel(this);
			}
		});
		$(ee_textbox).click(function(){
				$(".ee-fpanel").remove();
		});
		
		//because we can't access new elements with just click
		$(document).on('click',  'button#ee-font-ok', (function() {
			if(ee_selected_text != "" && ee_selected_text != null){
				ee_font(ee_selected_text, ee_start, ee_end, ee_textbox, $("#ee-font-family").val(), $("#ee-font-color").val(), $("#ee-font-size").val());
				ee_selected_text = "";
			}
		}));
	}
		
	/*==-Effects!-==*/
	function ee_bold(text, start, end, ee_textbox){
		pattern = "<b>" + text + "</b>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	
	function ee_italic(text, start, end, ee_textbox){
		pattern = "<i>" + text + "</i>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	function ee_underline(text, start, end, ee_textbox){
		var pattern = "<u>" + text + "</u>";
		ee_textbox.val(ee_textbox.val().replaceBetween(start, end, pattern));
	}
	
	function ee_align(text, start, end, ee_textbox, direction){
		var pattern = "";
		switch(direction){
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
		var pattern = "<p style='font-family:"+family+";color:"+color+";font-size:"+size+"pt;'>" + text + "</p>";
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