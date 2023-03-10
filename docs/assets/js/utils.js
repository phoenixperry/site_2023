//patch a href attributes
const header_links = document.querySelectorAll('a[href*="#"]');
if (header_links) {
  for (var i = 0; i < header_links.length; i++) {
    const header = header_links[i].getAttribute("href").replace("^.*#", "");
    //replace " " with "-"
    let header_fix = header.replace(/\s/g, "-");
    //replace any accent with the corresponding letter
    header_fix = header.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    header_links[i].setAttribute(
      "href",
      header_links[i].getAttribute("href").replace(header, header_fix)
    );
  }
}
function UrlExists(url, type_url) {
  let ref = "";
  let title = "";
  if (type_url === 0) {
    ref = url.href;
    title = url.title;
  } else if (type_url === 1) {
    ref = url.src;
    title = url.alt;
  }
  if (ref.match(/index$/)) {
    ref = ref.replace(/index$/, "");
  }
  if (ref.includes("%5C")) {
    ref = ref.replace(/%5C/g, "/");
  }
  ref = decodeURI(ref);
  if (type_url === 0) {
    url.href = ref;
    url.title = title;
    if (title.length === 0) {
      title = url.innerText;
      url.title = title;
    }
  } else if (type_url === 1) {
    url.src = ref;
    url.alt = title;
  }

  var http = new XMLHttpRequest();
  http.open("GET", ref, true);
  http.onload = function (e) {
    if (http.status == "404") {
      const newItem = document.createElement("div");
      newItem.innerHTML = title;
      newItem.classList.add("not_found");
      newItem.setAttribute("href", ref);
      try {
        url.parentNode.replaceChild(newItem, url);
      } catch (error) {
        // console.log(error)
      }
    } else {
      return true;
    }
  };
  http.send();
}

function getHeightWidth(alt) {
  const heightXwidthReg = new RegExp("\\d+x\\d+");
  const widthReg = new RegExp("\\d+");
  if (alt.match(heightXwidthReg)) {
    var width = parseInt(alt.split("x")[0]);
    var height = parseInt(alt.split("x")[1]);
    return [width, height];
  } else if (alt.match(widthReg)) {
    var width = parseInt(alt.match(widthReg)[0]);
    return [width, 0];
  } else {
    return [0, 0];
  }
}

var p_search = /\.{2}\//gi;
const not_found = [];
var ht = document.querySelectorAll("a:not(img)");
for (var i = 0; i < ht.length; i++) {
  if (
    !ht[i].getElementsByTagName("img").length > 0 &&
    !ht[i].getElementsByTagName("svg").length > 0
  ) {
    var link = UrlExists(ht[i], 0);
  }
}

var p_img = /\.+\\/gi;
var img = document.querySelectorAll("img");
for (var i = 0; i < img.length; i++) {
  var regAlt = new RegExp("\\|");
  // image can only be rized with the `|*x*` syntax
  if (img[i].alt.match(regAlt)) {
    const alt = img[i].alt.split("|");
    for (var part of alt) {
      if (part.match(new RegExp("\\d+", "g"))) {
        var size = getHeightWidth(part);
        img[i].width = size[0] > 0 ? size[0] : img[i].width;
        img[i].height = size[1] > 0 ? size[1] : img[i].height;
        var partReg = new RegExp(`\\${part}`);
        img[i].alt = img[i].alt.replace(partReg, "");
      }
    }
  }
  var link = UrlExists(img[i], 1);
}

var ht = document.querySelectorAll(
  "article.md-content__inner.md-typeset > *:not(.highlight)"
);
var scr = /\^(.*)/gi;
for (var i = 0; i < ht.length; i++) {
  const fp = ht[i].innerHTML.match(scr);
  if (fp) {
    ht[i].innerHTML = ht[i].innerHTML.replace(fp, "");
  }
}
document.innerHTML = ht;

var cite = document.querySelectorAll(".citation");
if (cite) {
  for (var i = 0; i < cite.length; i++) {
    var img = cite[i].innerHTML.match(/!?(\[{2}|\[).*(\]{2}|\))/gi);
    if (img) {
      for (var j = 0; j < img.length; j++) {
        cite[i].innerHTML = cite[i].innerHTML.replace(img[j], "");
      }
      if (cite[i].innerText.trim().length < 2) {
        cite[i].style.display = "none";
      }
    }
  }
}

//get iframe from graph.md
// check if page is graph.md
window.onload = function () {
  let frameElement = document.querySelector("iframe");
  if (!frameElement) {
    return;
  }
  let doc = frameElement.contentDocument || frameElement.contentWindow.document;
  let css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "css/template/utils.css";
  css.type = "text/css";
  doc.head.appendChild(css);
  const theme = document.querySelector("[data-md-color-scheme]");
  if (theme.getAttribute("data-md-color-scheme") === "default") {
    doc.body.setAttribute("class", "light");
  } else {
    doc.body.setAttribute("class", "dark");
  }
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        doc.body.setAttribute(
          "class",
          mkDocsChirpyTranslator[theme.dataset.mdColorScheme]
        );
      }
    });
  });
  observer.observe(theme, {
    attributes: true,
    attributeFilter: ["data-md-color-scheme"],
  });
};

var paletteSwitcher1 = document.getElementById("__palette_1");
var paletteSwitcher2 = document.getElementById("__palette_2");

const isMermaidPage = document.querySelector(".mermaid");
if (isMermaidPage) {
  paletteSwitcher1.addEventListener("change", function () {
    location.reload();
  });

  paletteSwitcher2.addEventListener("change", function () {
    location.reload();
  });
}
