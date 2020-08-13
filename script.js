// Code by Cameron Samuels


// Countdown
(function() {
  var el = document.querySelector("#countdown");
  var d = new Date("October 5, 2020 11:59:59") - new Date();
  el.textContent = "The deadline to register to vote in Texas is in " + Math.floor(d / 86400000) + " days";
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
  var els = document.querySelectorAll("#checklist li [contenteditable]");
  for (let i = 0; i < els.length; i++) {
    var val = els[i].parentElement.parentElement.id;
    if (localStorage[val])
      els[i].textContent = localStorage[val];
  }
  if (localStorage["vote-by-mail"]) {
    var absentee = localStorage["vote-by-mail"] == "true";
    document.querySelector("#vote-by-mail").checked = absentee;
    document.querySelector("#vote-in-person").checked = !absentee;
    selectVoteMethod();
  } else checkChange();
})();


// Clear checklist
document.querySelector("#clear-checklist").addEventListener("click", function() {
  var els = document.querySelectorAll("#checklist input");
  for (let i = 0; i < els.length; i++)
    els[i].checked = false;
  els = document.querySelectorAll("#checklist [contenteditable]");
  for (let i = 0; i < els.length; i++)
    els[i].textContent = "";
  checkChange();
  localStorage.clear();
});


// Show details
document.querySelector("#show-details").addEventListener("click", function() {
  document.body.classList.toggle("details");
  this.textContent = this.textContent == "Hide details" ? "Show details" : "Hide details";
});


// Voting date selection
(function() {
  var drop = document.querySelector("#select-date>div>div:nth-of-type(2)");
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var dates = ["13", "14", "15", "16", "18"]; // TODO
  for (let i = 0; i < dates.length; i++) {
    var date = new Date("October " + dates[i] + ", 2020 19:00:00");
    if (new Date() > date)
      continue;
    var str = days[date.getDay()] + ", October " + date.getDate();
    var el = document.createElement("div");
    el.textContent = str;
    drop.appendChild(el);
  }
})();


// Dropdown selections
(function() {
  function dropdownEvent(e) {
    var id;
    if (e.type == "click") {
      e.target.parentElement.parentElement.querySelector("div[contenteditable]").textContent = e.target.textContent;
      id = e.target.parentElement.parentElement.parentElement.id;
      e.target.parentElement.parentElement.parentElement.parentElement.querySelector("input[type='checkbox']").checked = true;
      checkChange();
    }
    else if (e.type == "input")
      id = e.target.parentElement.parentElement.id;
    document.querySelector(id.replace("select", "#statement")).textContent = e.target.textContent;
    localStorage[id] = e.target.textContent;
  }
  ["id", "transportation", "time", "location", "date"].forEach(function(i) {
    var els = document.querySelectorAll("#select-" + i + ">div>div>div");
    for (let j = 0; j < els.length; j++)
      els[j].addEventListener("click", dropdownEvent);
    document.querySelector("#select-" + i + ">div>div").addEventListener("input", dropdownEvent);
  });
})();


// Passting in text
document.body.onpaste = function(e) {
  return false;
};


// Print statement
document.querySelector("#print-statement").addEventListener("click", function() {
  window.print();
});


// Add statement to calendar
document.querySelector(".addeventatc").addEventListener("click", function() {
  var statement = document.querySelector(".statement.appearance");
  var date = statement.querySelector("#statement-date").textContent;
  var time = statement.querySelector("#statement-time").textContent;
  var datetime = date + time; // TODO "08/22/2020 08:00 AM"
  var location = statement.querySelector("#statement-location").textContent;
  var button = document.querySelector(".addeventatc");
  button.querySelector(".start").textContent = datetime;
  button.querySelector(".location").textContent = location;
  button.querySelector(".description p").textContent = statement.textContent;
});