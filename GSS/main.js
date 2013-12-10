function formatThatShit( content ) {
	var result = content;
	result = result.replace(/\ /g, "&nbsp;");
	result = result.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
	result = result.replace(/\n/g, "<br>");
	var keywords = [
		"mixin", "import", "extends", "when"
	];
	for ( var i = 0; i < keywords.length; i++ ) {
		var keyword = keywords[i];
		var replacement = "<span class='keyword'>"+keyword+"</span>";
		result = result.replace(new RegExp(keyword, "g"), replacement);
	}
	return result;
}

$( document ).ready( function() {
	var GSSCode = FileModule.getContent("test.gss");
	//Get and execute the Python implementation of the compiler

	var evalGSS = function( code ) {
		var gss = new GSS( FileModule.getContent, location.href );
		var tokens = gss.lex( code );
		var ast = gss.parse( tokens );
		var css = gss.compile( ast );
		return css;
	};
	$("link[type='text/gss']").each(function() {
		var url = $(this).attr("href");
		var getFile = function( path ) {
			var content = FileModule.getContent( path );
			//console.log( content );
			return content;
		};
		var gss = new GSS(getFile, location.href);
		Helpers.bind( gss );
		jQuery.get(url, function( content ) {
			GSSCode = content;
			var start = new Date().getTime();
			var tokens = gss.lex(content);
			var ast = gss.parse( tokens );
			var css = gss.compile( ast );
			var took = (new Date().getTime() - start);
			console.log("Compiled "+url+" - took " + took + " milliseconds.");
			var linker = $("<style type='text/css'>\n" + css + "\n</style>");
			$("head").append( linker );
		});
		
	});
	$("code.gss-example").each(function() {
		var content = $(this).text();
		$(this).data("source-code", content);
		console.log( content );
		var newContent = formatThatShit(content);
		$(this).text("");
		$(this).html(newContent);
	});
	$("button.example-runner").each(function() {
		var me = $(this);
		var target = $(me.attr("for"));
		var source = target.data("source-code");
		var fancyButton = $("<div class='fanceh-button'><span>"+me.text()+"</span></div>");
		me.replaceWith(fancyButton);
		var compiled = false;
		fancyButton.click(function() {
			target.html(formatThatShit((compiled?source:evalGSS(source))));
			fancyButton.text((compiled?"Compile":"Decompile"));
			compiled = !compiled;
		});
	});
});