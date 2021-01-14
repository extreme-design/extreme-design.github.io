var close = `<button class="close"><i class="fas fa-window-minimize"></i></button>`;
window.addEventListener("load", function() {
  loadSVG("img/mappa2.svg", $("#main-content"), mapCallBack);
});

var interaction;

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
  });
  $(selector).on("mouseleave", function() {
    $(selector).attr("opacity", "1.0");
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
        } else if(isInMin||isInMin2){
					$("#main-content svg").remove();
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
