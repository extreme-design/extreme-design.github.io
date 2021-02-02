var close = `<div class="close"><i class="fas fa-times"></i></div>`;
var interaction;

window.addEventListener("load", function() {
  loadSVG("img/mappa2.svg", $("#main-content"), mapCallBack);
});

function setInteraction(inter) {
  for (var key in inter) {
    if (inter.hasOwnProperty(key)) {
      makeSelectorActionableJQuery("." + key);
      setActionJQuery(key, inter[key]);
    }
  }
}

function mapCallBack() {
  if (interaction == undefined) {
    $.getJSON("interaction.json", function(data) {
      interaction = data;
      setInteraction(interaction);
    });
  } else {
    setInteraction(interaction);
  }
}

function makeSelectorActionableJQuery(selector) {
  $(selector).css("cursor", "pointer");
  $(selector).on("mouseenter", function() {
    $(selector).attr("opacity", "0.8");

		//console.log(t.translate[0]+" "+t.translate[1]);
		//console.log(parseFloat(t.translate[0])+parseFloat(t.translate[1]));
		//console.log("transform", "scale(2) transform("+t.translate[0]+""+t.translate[1]+")");
    //$(selector).attr("transform", "scale(2) translate("+t.translate[0]+""+t.translate[1]+")");
		//$(selector).attr("transform", "scale(2) "+$(selector).attr("transform"));
  });
  $(selector).on("mouseleave", function() {
    $(selector).attr("opacity", "1.0");
    //$(selector).removeAttr("transform");
		//var t = parseTransform($(selector).attr("transform"));
		//$(selector).attr("transform", "translate("+t.translate[0]+""+t.translate[1]+")");
  });
}



function setActionJQuery(clazz, action, svg) {
  for (var e in action) {
    if (action[e]["type"] == "svg") {
      $("." + clazz).on(e, function() {

        var isInMainContent = $(this).parents("#main-content").length > 0;
        var isInMin = $(this).parents("#min").length > 0;
        var isInMin2 = $(this).parents("#min2").length > 0;

        if (isInMainContent) {
          if ($("#min svg").length > 0) {
            // min is full, use min2
            $("#main-content svg").appendTo("#min2");
            $("#min2").prepend(close);
            makeSelectorActionableJQuery("#min2 .close");
            $("#min2 .close").on("click", function() {
              $("#main-content svg").remove();
              $("#min2 svg").appendTo("#main-content")
              $("#min2 .close").remove();
            });
          } else {
            $("#main-content svg").appendTo("#min");
            $("#min").prepend(close);
            makeSelectorActionableJQuery("#min .close");
            $("#min .close").on("click", function() {
              $("#main-content svg").remove();
              $("#min2 svg").remove();
              $("#min2 .close").remove();
              $("#" + $(this).parent().attr("id") + " svg").appendTo("#main-content")
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
        loadSVG(action[e]["path"], $("#main-content"), mapCallBack);
      });
    }

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
