// Code by Cameron Samuels


// Helper functions
function formatDate(date) {
  var time = document.querySelector("#select-time>input[type='time']").value || "07:00";
  return new Date(date + "T" + time).toLocaleString("default", { weekday: "long", month: "long", day: "numeric" });
}
function formatTime(time) {
  var hour = parseInt(time.substring(0, 2));
  var min = time.substring(3);
  var period = "AM";
  if (hour > 12) {
    hour -= 12;
    period = "PM";
  }
  return hour + ":" + min + " " + period;
}


// Temporary features
(function() {
  // November 3 election
  var el = document.querySelector("#select-date input[type='date']");
  var today = new Date();
  var dd = (today.getDate() < 10 ? "0" : "") + today.getDate();
  var mm = (today.getMonth() + 1 < 10 ? "0" : "") + (today.getMonth() + 1);
  el.setAttribute("min", "2020-" + mm + "-" + dd);
  el.setAttribute("max", "2020-11-03");
})();


// Large checkboxes
(function() {
  var els = document.querySelectorAll("#checklist input[type='checkbox']");
  window.checkChange = function(e) {
    var checks = document.querySelectorAll("#checklist input[type='checkbox']");
    var first = false;
    for (let i = 0; i < checks.length; i++) {
      var visible = checks[i].parentElement.parentElement.tagName == "UL"
        || (checks[i].parentElement.parentElement.tagName == "DIV"
        && !checks[i].parentElement.parentElement.style.display);
      if (checks[i].checked || first || !visible)
        checks[i].parentElement.classList.remove("large");
      else if (!first && visible) {
        checks[i].parentElement.classList.add("large");
        first = true;
      }
      localStorage[checks[i].id] = checks[i].checked;
    }
    if (document.querySelector(".large") == null)
      document.querySelector("ul>li:last-child").classList.add("large");
    else document.querySelector("ul>li:last-child").classList.remove("large");
  }
  for (let i = 0; i < els.length; i++)
    els[i].addEventListener("change", checkChange);
})();


// Voting method selection
(function() {
  window.selectVoteMethod = function() {
    var absentee = document.querySelector("#vote-by-mail").checked;
    if (!absentee && !document.querySelector("#vote-in-person").checked) {
      var els = Array.prototype.slice.call(document.querySelectorAll(".absentee")).concat(Array.prototype.slice.call(document.querySelectorAll(".appearance")));
      for (let i = 0; i < els.length; i++)
        els[i].style.display = "";
    }
    else {
      var els = document.querySelectorAll(".absentee");
      for (let i = 0; i < els.length; i++)
        els[i].style.display = absentee ? "" : "none";
      els = document.querySelectorAll(".appearance");
      for (let i = 0; i < els.length; i++)
        els[i].style.display = absentee ? "none" : "";
    }
    checkChange();
  }
  function voteMethodChange() {
    document.querySelector("#choose-method").checked = true;
    localStorage["vote-by-mail"] = document.querySelector("#vote-by-mail").checked;
    selectVoteMethod();
  }
  document.querySelector("#vote-in-person").addEventListener("change", voteMethodChange);
  document.querySelector("#vote-by-mail").addEventListener("change", voteMethodChange);
  document.querySelector("#choose-method").addEventListener("change", function() {
    if (!this.checked) {
      document.querySelector("#vote-in-person").checked = false;
      document.querySelector("#vote-by-mail").checked = false;
      localStorage.removeItem("vote-by-mail");
      selectVoteMethod();
    }
  });
})();


// Saved checklist
(function() {
  var els = document.querySelectorAll("#checklist input[type='checkbox']");
  for (let i = 0; i < els.length; i++) {
    if (localStorage[els[i].id])
      els[i].checked = localStorage[els[i].id] == "true";
  }
  var els = document.querySelectorAll("#checklist li input:not([type='checkbox']):not([type='radio'])");
  for (let i = 0; i < els.length; i++) {
    var val = els[i].parentElement.id;
    if (localStorage[val])
      els[i].value = localStorage[val];
  }
  var els = document.querySelectorAll(".statement span");
  for (let i = 0; i < els.length; i++) {
    var id = els[i].id;
    var val = localStorage[id.replace("statement", "select")];
    if (!val) continue;
    if (id == "statement-date" || id == "statement-mail-date") val = formatDate(val);
    if (id == "statement-time") val = formatTime(val);
    els[i].textContent = val;
  }
  if (localStorage["vote-by-mail"]) {
    var absentee = localStorage["vote-by-mail"] == "true";
    document.querySelector("#vote-by-mail").checked = absentee;
    document.querySelector("#vote-in-person").checked = !absentee;
    selectVoteMethod();
  }
  else checkChange();
})();


// Clear checklist
document.querySelector("#clear-checklist").addEventListener("click", function() {
  var els = document.querySelectorAll("#checklist input");
  for (let i = 0; i < els.length; i++) {
    var el = els[i];
    if (el.type == "checkbox" || el.type == "radio")
      el.checked = false;
    else el.value = "";
  }
  var els = document.querySelectorAll(".statement span");
  for (let i = 0; i < els.length; i++)
    els[i].textContent = "(" + els[i].id.replace("statement-", "") + ")";
  checkChange();
  localStorage.clear();
});


// Show details
document.querySelector("#show-details").addEventListener("click", function() {
  document.body.classList.toggle("details");
  this.textContent = this.textContent == "Hide Details" ? "Show Details" : "Hide Details";
});


// Location selection
function initMap() {
  function placeChange(autocomplete, j) {
    return function() {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      address = place.name + ", " + address;
      document.querySelector("#statement-" + j).textContent = address;
      localStorage["select-" + j] = address;
      document.querySelector("#" + (j == "location" ? "appearance" : "absentee") + "-location").checked = true;
      checkChange();
    }
  }
  var locs = ["location", "dropoff-location"];
  for (let i = 0; i < locs.length; i++) {
    var j = locs[i];

    var input = document.querySelector("#" + j);
    var autocomplete = new google.maps.places.Autocomplete(input);

    function inputEvent(e) {
      var k = e.target.id;
      localStorage["select-" + k] = e.target.value;
      document.querySelector("#statement-" + k).textContent = e.target.value;
    }

    input.addEventListener("input", inputEvent);

    input.parentElement.addEventListener("click", function(e) {
      if (e.target.disabled) {
        e.target.removeAttribute("disabled");
        e.target.removeAttribute("class");
        e.target.removeAttribute("placeholder");
        e.target.removeAttribute("style");
        var old = e.target;
        var newEl = old.cloneNode(true);
        old.parentNode.replaceChild(newEl, old);
        newEl.addEventListener("input", inputEvent);
      }
    });

    autocomplete.addListener('place_changed', placeChange(autocomplete, j));
  }
}


// Voting date selection
(function() {
  document.querySelector("#select-date>input[type='date']").addEventListener("input", function() {
    var date = formatDate(this.value);
    if (!this.value || date == "Invalid Date") date = "(date)";
    document.querySelector("#statement-date").textContent = date;
    localStorage["select-date"] = this.value;
  });
  document.querySelector("#select-mail-date>input[type='date']").addEventListener("input", function() {
    var date = formatDate(this.value);
    if (!this.value || date == "Invalid Date") date = "(date)";
    document.querySelector("#statement-mail-date").textContent = date;
    localStorage["select-mail-date"] = this.value;
  });
})();


// Voting time selection
(function() {
  document.querySelector("#select-time>input[type='time']").addEventListener("input", function() {
    var time = formatTime(this.value);
    if (time.includes("NaN")) time = "(time)";
    document.querySelector("#statement-time").textContent = time;
    localStorage["select-time"] = this.value;
  });
})();


// Dropdown selections
(function() {
  function dropdownEvent(e) {
    var id;
    var val = e.target.value || e.target.textContent;
    if (e.type == "click") {
      e.target.parentElement.parentElement.querySelector("input[type='text']").value = val;
      id = e.target.parentElement.parentElement.id;
      e.target.parentElement.parentElement.parentElement.parentElement.querySelector("input[type='checkbox']").checked = true;
      checkChange();
    }
    else if (e.type == "input")
      id = e.target.parentElement.id;
    document.querySelector(id.replace("select", "#statement")).textContent = val;
    localStorage[id] = val;
  }
  document.querySelectorAll(".dropdown").forEach(function(i) {
    i = i.id.substring(7);
    var els = document.querySelectorAll("#select-" + i + ">div>div");
    for (let j = 0; j < els.length; j++)
      els[j].addEventListener("click", dropdownEvent);
    document.querySelector("#select-" + i + " input[type='text']").addEventListener("input", dropdownEvent);
  });
})();


// Hide print for Android (incompatible)
if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
  document.querySelector("#print-statement").style.display = "none";
  document.querySelector("#print-blank").style.display = "none";
}


// Print statement
document.querySelector("#print-statement").addEventListener("click", function() {
  document.body.className = "";
  document.body.classList.add("print-statement");
  window.print();
});


// Print blank checklist
document.querySelector("#print-blank").addEventListener("click", function() {
  document.body.className = "";
  document.body.classList.add("print-blank");
  window.print();
});


// Default print styles
document.body.addEventListener("keydown", function() {
  document.body.classList.remove("print-blank");
  document.body.classList.remove("print-statement");
});


// Add statement to calendar
document.querySelector(".addeventatc").addEventListener("click", function() {
  var button = document.querySelector(".addeventatc");
  var method = document.querySelector("#vote-by-mail").checked ? "absentee" : "appearance";
  var statement = document.querySelector(".statement." + method);
  if (method == "appearance") {
    var date = document.querySelector("#select-date input").value || "2020-10-20";
    var time = document.querySelector("#select-time input").value || "12:00 PM";
    var location = document.querySelector("#select-location input").value || "Polling Station";
    button.querySelector(".start").textContent = date + " " + time;
    button.querySelector(".location").textContent = location;
    button.querySelector(".alarm_reminder").textContent = "1440";
    button.querySelector(".all_day_event").textContent = "false";
  }
  else {
    var date = document.querySelector("#select-mail-date input").value || "2020-10-10";
    button.querySelector(".start").textContent = date;
    button.querySelector(".location").textContent = "Vote By Mail";
    button.querySelector(".alarm_reminder").textContent = "14400";
    button.querySelector(".all_day_event").textContent = "true";
  }
  button.querySelector(".description span").textContent = statement.textContent;
});