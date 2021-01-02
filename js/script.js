var svgObject;
var svgElem;

var loadBoundingClientRectSvg;

window.addEventListener("load", function() {
  svgObject = document.getElementById('svg-object').contentDocument;
  svgElem = svgObject.getElementsByTagName("svg")[0];
	//svgElem.setAttribute("width", "100%");
	//svgElem.setAttribute("height", "100%");
	svgElem.setAttribute("viewBox","0 0 1280 680");
	//svgElem.setAttribute("preserveAspectRatio","none");


	loadBoundingClientRectSvg = svgElem.getBoundingClientRect();
	svgElem.removeAttribute("enable-background");
	svgElem.removeAttribute("width");
	svgElem.removeAttribute("height");
	svgElem.removeAttribute("x");
	svgElem.removeAttribute("y");


  var svg = svgObject.getElementsByClassName("RequirementCollection");
  for (var i = 0; i < svg.length; i++) {
    svg[i].style.cursor = "pointer";
    svg[i].addEventListener("click", function() {
			if(svgElem.getAttribute("transform")){
				svgElem.removeAttribute("transform");
			} else 	{
				var currentWidth = svgElem.getBoundingClientRect().width;
				var currentHeight = svgElem.getBoundingClientRect().height ;
				var calcWidth = currentWidth/5;
				var calcHeight = currentHeight/5;
				svgElem.setAttribute("transform", "translate ("+(2*calcWidth) + " -"+(2*calcHeight)+ ") scale(0.2)");
			}

    });
    svg[i].addEventListener("mouseenter", function(event) {
      elementMouseEnter("RequirementCollection");
    }, false);
    svg[i].addEventListener("mouseleave", function(event) {
      elementMouseLeave("RequirementCollection");
    }, false);
  }
});

function setAttribute(clazz, attribute, value) {
  var svg2 = svgObject.getElementsByClassName(clazz);
  for (var i = 0; i < svg2.length; i++) {
    svg2[i].setAttribute(attribute, value);
  }
}

function elementMouseEnter(clazz) {
  setAttribute(clazz, "opacity", "0.8");
}

function elementMouseLeave(clazz) {
  setAttribute(clazz, "opacity", "1.0");
}
