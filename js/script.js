var close = `<div class="close"><i class="fas fa-times"></i></div>`;
var interaction;
var text;
var classes;

//console.log = function() {}


$(document).ready(function(){
   $.extend($.expr[':'], {
     BebasNeue: function(elem){
        var $e = $(elem);
        return( typeof $e.css('font-family') !== 'undefined' && $e.css('font-family') === 'BebasNeue' );
     },
 });
});

window.addEventListener("load", function() {
  loadSVG("img/schema1.svg", $("#main-content"), mapCallBack);
});

function setInteraction(inter) {
	console.log("Set interaction")
  for (var key in inter) {
		console.log("key "+key)
    if (inter.hasOwnProperty(key)) {
      makeSelectorActionableJQuery("." + key);
      setActionJQuery(key, inter[key]);
    }
  }
}

function mapCallBack() {
  if (interaction == undefined) {
    $.getJSON("classes.json", function(data) {
			classes=data;
      addClasses();
      $.getJSON("interaction.json", function(data2) {
        interaction = data2;
        setInteraction(interaction);
      });
    });
  } else {
		addClasses();
    setInteraction(interaction);
  }
}

function addClasses(){
	console.log("add classes")
	for (var k in classes) {
		var elm = $("#" + k);
		if (elm.length == 0) {
			console.log("Und key " + k);
		} else {
			elm.addClass(classes[k]);
			elm.children().addClass(classes[k]);
		}
	}
}

function makeSelectorActionableJQuery(selector) {
	console.log("make actionable "+selector)
	//console.log($(selector).length)
  $(selector).css("cursor", "pointer");
  $(selector).on("mouseenter", function() {
    $(selector).attr("opacity", "0.8");
  });
  $(selector).on("mouseleave", function() {
    $(selector).attr("opacity", "1.0");
  });
}

function setActionJQuery(clazz, action, svg) {
  for (var e in action) {
    if (action[e]["type"] == "svg") {
      $("." + clazz).on(e, function() {
        click($(this))
        loadSVG(action[e]["path"], $("#main-content"), mapCallBack);
      });
    } else if (action[e]["type"] == "text") {
				$("." + clazz).on(e, function() {
					click($(this));
					var toappend = getText(action[e]["title"], action[e]["body"])
					$("#main-content .row").remove();
					$("#main-content").append(toappend)
				});
		}

  }
}

function getText(title, body){
	var result =`<div class="row text-content" style="height:25%">
        <div class="col">
            <h1>${title}</h1>
        </div>
    </div>
    <div class="row text-content" style="height:75%">
        <div class="col">
            <p>${body}</p>
        </div>
    </div>`
		return result
}

function click(elem){

	// true if the click is in #main-content
	var isInMainContent = elem.parents("#main-content").length > 0;

	// true if the click is in #min
	var isInMin = elem.parents("#min").length > 0;

	// true if the click is in #min2
	var isInMin2 = elem.parents("#min2").length > 0;

	// true if the click is within an svg
	var isSvg = elem.parents("svg").length > 0


	if (isInMainContent) {
		if ($("#min svg").length > 0) {
			// min is full, append the content in min2
			$("#main-content svg").appendTo("#min2");
			$("#min2").prepend(close);
			makeSelectorActionableJQuery("#min2 .close");
			$("#min2 .close").on("click", function() {
				$("#main-content svg").remove();
				$("#main-content .row").remove();
				$("#min2 svg").appendTo("#main-content")
				$("#min2 .close").remove();
			});
		} else {
			$("#main-content svg").appendTo("#min");
			$("#min").prepend(close);
			makeSelectorActionableJQuery("#min .close");
			$("#min .close").on("click", function() {
				$("#main-content svg").remove();
				$("#main-content .row").remove();
				$("#min2 svg").remove();
				$("#min2 .close").remove();
				$("#min svg").appendTo("#main-content")
				$("#min .close").remove();
			});
		}
	} else if (isInMin2) {
		$("#main-content svg").remove();
	} else if (isInMin) {
		$("#main-content svg").remove();
		$("#min2 svg").remove();
		$("#min2 .close").remove();
	}
}



function loadSVG(file, elem, callback) {
  elem.load(file, function() {
    var svg = elem.find("svg");
    svg.removeAttr("enable-background");
    svg.removeAttr("width");
    svg.removeAttr("height");
    svg.removeAttr("x");
    svg.removeAttr("y");
    svg.attr("height", "100%");
    svg.attr("width", "100%");
		$(':BebasNeue').css("font-family", "Bebas Neue");
		svg.append( "<defs><style type=\"text/css\">@import url('http://fonts.googleapis.com/css?family=Bebas+Neue');</style></defs>" );
    callback();
  });
}

function parseTransform(a) {
  var b = {};
  for (var i in a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g)) {
    var c = a[i].match(/[\w\.\-]+/g);
    b[c.shift()] = c;
  }
  return b;
}
