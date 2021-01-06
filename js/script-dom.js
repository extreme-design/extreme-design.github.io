window.addEventListener("load", function() {
  //mapCallBack(svg);
  loadSVGDOM("img/mappa2.svg","main-content","svg-main-content");
	//setInteraction(document.getElementById("svg-main-content").contentDocument);
	mapCallBack($("main-content"))

});

var interaction;
var makeClassActionable = makeClassActionableJQuery;
var setAction = setActionJQuery;

function setInteraction(inter, svg) {
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
      setInteraction(interaction, svg);
    });
  } else {
    setInteraction(interaction, svg);
  }
  //setAttributeOfElementById("reduce", svg, "visibility", "hidden");
}

function setAttributeOfElementById(id, svg, attribute, value) {
  svg.getElementById(id).setAttribute(attribute, value);
}

function makeClassActionableJQuery(clazz, svg) {
  $("." + clazz).css("cursor", "pointer");
  $("." + clazz).on("mouseenter", function() {
    $("." + clazz).attr("opacity", "0.8");
  });
  $("." + clazz).on("mouseleave", function() {
    $("." + clazz).attr("opacity", "1.0");
  });
}

function setAttribute(svg, clazz, attribute, value) {
  var svg2 = svg.getElementsByClassName(clazz);
  for (var i = 0; i < svg2.length; i++) {
    svg2[i].setAttribute(attribute, value);
  }
}

function elementMouseEnter(svg, clazz) {
  setAttribute(svg, clazz, "opacity", "0.8");
}

function elementMouseLeave(svg, clazz) {
  setAttribute(svg, clazz, "opacity", "1.0");
}

function makeClassActionableDOM(clazz, svg) {
  var elems = svg.getElementsByClassName(clazz);
  for (var i = 0; i < elems.length; i++) {
    elems[i].style.cursor = "pointer";
    elems[i].addEventListener("mouseenter", function(event) {
      elementMouseEnter(svg, clazz);
    }, false);
    elems[i].addEventListener("mouseleave", function(event) {
      elementMouseLeave(svg, clazz);
    }, false);
  }
}

function setActionJQuery(clazz, action, svg) {
  for (var e in action) {
    if (action[e]["type"] == "svg") {
      $("." + clazz).on(e, function() {
        if ($("#min svg").length > 0) {
          $("#main-content svg").remove();
        } else {
          $("#main-content svg").appendTo("#min");
          $("#reduce").attr("visibility", "visible");
        }
        loadSVGDOM(action[e]["path"], "#min", mapCallBack);
      });
    }

  }
}

function setActionDOM(clazz, action, svg) {
  console.log("set action " + clazz + " " + action)
  for (var e in action) {
    if (action[e]["type"] == "svg") {

      var elems = svg.getElementsByClassName(clazz);
      for (var i = 0; i < elems.length; i++) {
        elems[i].addEventListener(e, function(event) {
          // move
          var min = document.getElementById("min");
          min.append(svg.firstChild);

          svg.firstChild.setAttributeNS(null, 'width', '100%');
          svg.firstChild.setAttributeNS(null, 'height', '100%');



        }, false);
      }


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

function loadSVGDOM(file, elementId,elementId) {
  xhr = new XMLHttpRequest();
  xhr.open("GET", file, false);
  xhr.overrideMimeType("image/svg+xml");
  xhr.onload = function(e) {
    var loaded = xhr.responseXML.documentElement;
		loaded.setAttribute("width","100%");
		loaded.setAttribute("height","100%");
		loaded.setAttribute("id",elementId);
    document.getElementById("main-content").appendChild(loaded);
  }
  xhr.send("");
}
