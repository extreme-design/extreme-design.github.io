WebView.getSettings().setJavaScriptEnabled(true);

var enlarge = "<span class=\"dot\">	<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrows-angle-expand\" viewBox=\"0 0 16 16\">		<path fill=\"white\" fill-rule=\"evenodd\" d=\"M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z\" />	</svg></span>";


window.addEventListener("load", function() {
  loadSVG("img/mappa.svg", $("#svg-object"), "0 0 1280 680", mapCallBack);
  //loadSVG("img/mappa.svg", $("#svg-min"), "0 0 1280 680");
  //loadSVG("img/mappa.svg", $("#svg-logo"), "0 0 1280 680");
});

function mapCallBack(p) {
  $.getJSON("interaction.json", function(data) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        makeClassActionable(key);
        setAction(key, data[key]);
      }
    }
  });
}

function makeClassActionable(clazz) {
  $("." + clazz).css("cursor", "pointer");
  $("." + clazz).on("mouseenter", function() {
    $("." + clazz).attr("opacity", "0.8");
  });
  $("." + clazz).on("mouseleave", function() {
    $("." + clazz).attr("opacity", "1.0");
  });
}

function setAction(clazz, action) {
  for (var e in action) {
    if (action[e]["type"] == "svg") {
      $("." + clazz).on(e, function() {
        if ($("#svg-min svg").length > 0) {
          $("#svg-object svg").remove();
        } else {
          $("#svg-object svg").appendTo("#svg-min");
					$("#svg-min").parent().append(enlarge);
					$(".dot").css("cursor","pointer");
					$(".dot").on("click",function(){
						$("#svg-object svg").remove();
						$(".dot").remove();
						$("#svg-min svg").appendTo("#svg-object");
					});
        }
        loadSVG(action[e]["path"], $("#svg-object"), action[e]["viewBox"], mapCallBack);
      });
    }
  }
}

function loadSVG(file, elem, viewBox, callback) {
  elem.load(file, function() {
    var svg = elem.find("svg");
    svg.removeAttr("enable-background");
    svg.removeAttr("width");
    svg.removeAttr("height");
    svg.removeAttr("x");
    svg.removeAttr("y");
    svg.attr("viewBox", viewBox);
    svg.attr("height", "100%");
    svg.attr("width", "100%");
    callback("BLA");
  });
}
