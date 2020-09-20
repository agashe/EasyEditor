# EasyEditor
WYSIWYG editor plugin for jQuery.

## Features
- Lightweight ~5kb
- Easy to use , 0 config required
- Seperate Preview window
- Ability to check and edit the html result before saving
- All the options within the editor are using valid , modern and pure html tags
- All basic text manipulation operations (Bold , Italic , ... etc)
- links , lists , images , emojis .. and a lot of useful things :)

## Installation
Just download both **easyeditor.min.css** and **easyeditor.min.js** , then include them 
in your base html. *And of course don't forget to include the jQuery library itself (>=1.10.0)* :D

``` 
<head>
  .
  .
  .
  
  <link rel="stylesheet" type="text/css" href="easyeditor.min.css" >
</head>

<body>
  .
  .
  .
  
  <script src="jquery-3.5.1.min.js" type="text/javascript"></script>
  <script src="easyeditor.min.js" type="text/javascript"></script>
</body>
```

Then all what you need to do is to call the *EasyEditor()* method on the choosen textarea!
```
<textarea id="test"></textarea>
.
.
.
<script>
  $("#test").EasyEditor();
</script>
```

## How To Use ??
Select the text , then click on the desired effect/option , the text will be wrapped 
with a proper HTML tag , only 3 options are working in differant manner:

1. Anchors <a> : you select the text , but after you click on the anchor's button
   and the text is wrapped with the <a> tag , you should enter the URL *href* manually!

2. Images <img> : no selection here is required , you just click on the image button then 
   a new <img> tag will be included to the text , you should enter both the *src* and *alt* manually.
   
3. emoji : by click on the emoji button , will add an emoji on the curser position , also no text
   selection is required here.

## License
(EasyEditor v2.0.0) released under the terms of the MIT license.
