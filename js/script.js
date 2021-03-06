//var close = `<div class="close"><i class="fas fa-times"></i></div>`;
var close = `<div class="close"><i class="fas fa-expand"></i></div>`;

var interaction;
var text;
var classes;

debug = console.log
//debug = function() {}

$('a[nav-button]').click(clicklink);

var h = ['main'];

$(document).ready(function() {
  $.extend($.expr[':'], {
    BebasNeue: function(elem) {
      var $e = $(elem);
      return (typeof $e.css('font-family') !== 'undefined' && $e.css('font-family') === 'BebasNeue');
    },
  });
});

window.addEventListener("load", function() {
  loadSVG("img/schema1.svg", "#main-content", mapCallBack, "General Process");
});

function setInteraction(inter) {
  //console.log("Set interaction")
  for (var key in inter) {
    //console.log("key " + key)
    if (inter.hasOwnProperty(key)) {
      makeSelectorActionableJQuery("." + key);
      setActionJQuery(key, inter[key]);
    }
  }
}

function mapCallBack() {
  if (interaction == undefined) {
    $.getJSON("classes.json", function(data) {
      classes = data;
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

function addClasses() {
  //console.log("add classes")
  for (var k in classes) {
    var elm = $("#" + k);
    if (elm.length == 0) {
      debug("Undefined key " + k);
    } else {
      elm.addClass(classes[k]);
      elm.children().addClass(classes[k]);
    }
  }
}

function makeSelectorActionableJQuery(selector) {
  //console.log("make actionable " + selector)
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
      //debug(`Add ${e} on ${clazz} ${  $("." + clazz+":not([clickable])").length}`);
      $("." + clazz + ":not([clickable])").on(e, function(ev) {
        ev.stopPropagation();
        click($(this))
        loadSVG(action[e]["path"], "#main-content", mapCallBack, action[e]["title"]);
        h = ["main"]
      });
      $("." + clazz).attr("clickable", "true")

    } else if (action[e]["type"] == "text") {
      $("." + clazz + ":not([clickable])").on(e, function(ev) {
        ev.stopPropagation();
				$("#title-content").remove()
        if (h[h.length - 1] != clazz) {
          debug("Click on " + clazz)
          click($(this));
          var toappend = getText(action[e]["title"], action[e]["body"], action[e]["background"], action[e]["color"], null, clazz);
          $("#main-content .row").remove();
          $("#main-content").append(toappend);
          h.push(clazz);
					debug(h)
          $('a:not([nav-button])').click(clicklink);
        }else{
					debug("do nop")
				}
      });
    }
  }
}



function clicklink(e2) {
  debug("Click " + $(this).attr("href") + " " + $(this).attr("nav-button"));
  if ($(this).attr("href") in interaction) {
    e2.preventDefault();

    if ($(this).attr("nav-button")) {
      click($("#main-content svg"));
    }

    var ref = $(this).attr("href");
    debug($(this).parent().attr("key"))
    debug(interaction[ref])
    debug(interaction[ref]["click"]["title"])

    if ($(this).attr("back")) {
      debug("POP " + h.pop());
      if (h[h.length - 1] != "main")
        debug("POP " + h.pop());
      debug(h[h.length - 1])
    }

    //if ($(this).parent().attr("key") != undefined) {
    //h.push($(this).parent().attr("key"));
    //}

    var toappend2 = getText(interaction[ref]["click"]["title"], interaction[ref]["click"]["body"], interaction[ref]["click"]["background"], interaction[ref]["click"]["color"], $(this).parent().attr("key"), ref);
    $("#main-content .row").remove();
    $("#main-content").append(toappend2)

    debug("hey here")
    //if (!$(this).attr("back")) {
    if (h[h.length - 1] != $(this).attr("href")) {
      h.push($(this).attr("href"))
    }
    //}

    $('a:not([nav-button])').click(clicklink);

		$("#title-content").remove();
  }
}

function getText(title, body, background, color, back, key) {

  if (background == null) {
    background = "#99ccff";
  }

  if (color == null) {
    color = "black"
  }

  debug("Color " + color)
  debug(h)

	var symbols="";



	if(key+"Roles" in interaction){
		symbols += `<a href="${key}Roles"><img src="img/roles.svg"></a>`
	}

	if(key+"Tools" in interaction){
		symbols += `<a href="${key}Tools"><img src="img/tools.svg"></a>`
	}

	if(key+"Examples" in interaction){
		symbols += `<a href="${key}Examples"><img src="img/examples.svg"></a>`
	}

  var result = `
    <div class="row text-content" style="height:100%;">
        <div class="col">
						<div id="text-content-shape" style="background: ${background};">
							<div id="text-content-frame">
								<div id="text-content-text">
									<div>`;


  if (h[h.length - 1] != "main") {
    result += `<a href="${h[h.length-1]}" style="text-decoration: none;" back="true"><i class="fas fa-arrow-left"></i> Back</a>`;
  }


  result += `

										<h1 style="color: ${color}; font-family: 'Bebas Neue'; font-size: 2.5rem;">${title} ${symbols}</h1>
										<p style="color: ${color};" key="${key}">${body}</p>
									</div>
								</div>
							</div>
						</div>
        </div>
    </div>`;
  return result
}

function click(elem) {

  // true if the click is in #main-content
  var isInMainContent = elem.parents("#main-content").length > 0;

  // true if the click is in #min
  var isInMin = elem.parents("#min").length > 0;

  // true if the click is in #min2
  var isInMin2 = elem.parents("#min2").length > 0;

  // true if the click is in #min2
  var isInMin2 = elem.parents("#min3").length > 0;

  // true if the click is within an svg
  var isSvg = elem.parents("svg").length > 0


  if (isInMainContent) {
    if ($("#min svg").length > 0 && $("#min2 svg").length == 0) {
      // min is full, append the content to min2
      $("#main-content svg").appendTo("#min2");
      $("#min2").prepend(close);
      makeSelectorActionableJQuery("#min2 .close");
      $("#min2 .close").on("click", function() {
        $("#main-content svg").remove();
        $("#main-content .row").remove();
        $("#min2 svg").appendTo("#main-content");
				$("#title-content").remove()
				$("#main-content").prepend(`<h1 id="title-content" style="text-align:center; font-family: 'Bebas Neue'">${$("#main-content svg").attr("title")}</h1>`);
        $("#min2 .close").remove();
        $("#min3 svg").remove();
        $("#min3 .close").remove();
				h=["main"]
				debug(h)
      });
    } else if ($("#min svg").length > 0 && $("#min2 svg").length > 0) {
      // min is full, min2 is full, append the content to min3
      $("#main-content svg").appendTo("#min3");
      $("#min3").prepend(close);
      makeSelectorActionableJQuery("#min2 .close");
      $("#min3 .close").on("click", function() {
        $("#main-content svg").remove();
        $("#main-content .row").remove();
				$("#title-content").remove()
        $("#min3 svg").appendTo("#main-content")

				$("#main-content").prepend(`<h1 id="title-content" style="text-align:center; font-family: 'Bebas Neue'">${$("#main-content svg").attr("title")}</h1>`);

        $("#min3 .close").remove();
				h=["main"]
				debug(h)
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
        $("#min3 svg").remove();
        $("#min3 .close").remove();
        $("#min svg").appendTo("#main-content");
				$("#title-content").remove()
				$("#main-content").prepend(`<h1 id="title-content" style="text-align:center; font-family: 'Bebas Neue'">${$("#main-content svg").attr("title")}</h1>`);
				$("#min .close").remove();
				h=["main"]
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

function loadSVG(file, selector, callback,title) {
  debug("load svg " + file)
  elem = $(selector)



  elem.load(file, function() {

    var svg = elem.find("svg");
    svg.removeAttr("enable-background");
    svg.removeAttr("width");
    svg.removeAttr("height");
    svg.removeAttr("x");
    svg.removeAttr("y");
		svg.attr("title",title);
    svg.attr("height", "100%");
    svg.attr("width", "100%");
    svg.attr("filename", file)
    $(':BebasNeue').css("font-family", "Bebas Neue");
    //https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap
    //svg.append("<defs><style type=\"text/css\">@import url('http://fonts.googleapis.com/css?family=Bebas+Neue');</style></defs>");
    svg.append("<defs><style type=\"text/css\">@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');</style></defs>");
    callback();


		if(selector=="#main-content" && title != null){
			elem.prepend(`<h1 id="title-content" style="text-align:center; font-family: 'Bebas Neue'">${title}</h1>`);
		}

  });


}

/*
function parseTransform(a) {
  var b = {};
  for (var i in a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g)) {
    var c = a[i].match(/[\w\.\-]+/g);
    b[c.shift()] = c;
  }
  return b;
}
*/
