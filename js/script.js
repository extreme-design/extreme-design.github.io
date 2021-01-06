window.addEventListener("load", function() {
  //loadSVG("img/mappa2.svg", $("#svg-object"), mapCallBack);
  var svg = $("#svg-object").getSVG();
  mapCallBack(svg);
  //loadSVG("img/mappa.svg", $("#svg-object"), "0 0 1280 680", mapCallBack);
  //loadSVG("img/mappa.svg", $("#svg-min"), "0 0 1280 680");
  //loadSVG("img/mappa.svg", $("#svg-logo"), "0 0 1280 680");
});

var interaction;

function setInteraction(inter,svg){
	for (var key in inter) {
    if (inter.hasOwnProperty(key)) {
      makeClassActionable(key, svg);
      setAction(key, inter[key], svg);
    }
  }
}

function mapCallBack(svg) {
  if (interaction == undefined) {
    $.getJSON("interaction.json", function(data) {
      interaction = data;
			setInteraction(interaction,svg);
    });
  }else{
		setInteraction(interaction,svg);
	}
  svg.find("#reduce").attr("visibility", "hidden");
}

function makeClassActionable(clazz, svg) {
  svg.find("." + clazz).css("cursor", "pointer");
  svg.find("." + clazz).on("mouseenter", function() {
    svg.find("." + clazz).attr("opacity", "0.8");
  });
  svg.find("." + clazz).on("mouseleave", function() {
    svg.find("." + clazz).attr("opacity", "1.0");
  });
}

function setAction(clazz, action, svg) {
  for (var e in action) {
    if (action[e]["type"] == "svg") {
      svg.find("."+clazz).on(e, function() {
        if ($("#svg-min svg").length > 0) {
          $("#svg-object svg").remove();
        } else {
					$("#svg-object").
          $("#svg-object").appendTo("#min");
          svg.find("#reduce").attr("visibility", "visible");
        }
        //loadSVG(action[e]["path"], $("#svg-object"), mapCallBack);
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
    elem.html(elem.html());
    //elem.attr("data",file);
    callback();
  });

}
