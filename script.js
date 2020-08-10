// Code by Cameron Samuels


// Countdown
(function() {
  var el = document.querySelector("#countdown");
  var d = new Date("October 5, 2020 11:59:59") - new Date();
  el.textContent = "The deadline to register to vote in Texas is in " + Math.floor(d / 86400000) + " days";
})();


// Checkbox
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
    var els = document.querySelectorAll(".absentee");
    for (let i = 0; i < els.length; i++)
      els[i].style.display = absentee ? "" : "none";
    els = document.querySelectorAll(".appearance");
    for (let i = 0; i < els.length; i++)
      els[i].style.display = absentee ? "none" : "";
    checkChange();
  }
  function voteMethodChange() {
    document.querySelector("#choose-method").checked = true;
    localStorage["vote-by-mail"] = document.querySelector("#vote-by-mail").checked;
    selectVoteMethod();
  }
  document.querySelector("#vote-in-person").addEventListener("change", voteMethodChange);
  document.querySelector("#vote-by-mail").addEventListener("change", voteMethodChange);
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
  var absentee = localStorage["vote-by-mail"] == "true";
  document.querySelector("#vote-by-mail").checked = absentee;
  document.querySelector("#vote-in-person").checked = !absentee;
  selectVoteMethod();
})();


// Clear checklist
document.querySelector("#clear-checklist").addEventListener("click", function() {
  var els = document.querySelectorAll("#checklist input[type='checkbox']");
  for (let i = 0; i < els.length; i++)
    els[i].checked = false;
  checkChange();
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
  function createDropdownEvents(dropdown, action) {
    var els = document.querySelectorAll("#" + dropdown + ">div>div>div");
    for (let i = 0; i < els.length; i++) {
      els[i].addEventListener("click", action);
      els[i].addEventListener("click", function(e) {
        var el = e.target.parentElement.parentElement.parentElement.parentElement.querySelector("input[type='checkbox']");
        el.checked = true;
        localStorage[el.id] = true;
        checkChange();
      });
    }
    document.querySelector("#" + dropdown + ">div>div").addEventListener("input", action);
  }
  createDropdownEvents("select-id", function(e) {
    document.querySelector("#select-id>div>div").textContent = e.target.textContent;
    document.querySelector("#statement-id").textContent = e.target.textContent;
    localStorage["select-id"] = e.target.textContent;
  });
  createDropdownEvents("select-transportation", function(e) {
    document.querySelector("#select-transportation>div>div").textContent = e.target.textContent;
    document.querySelector("#statement-transportation").textContent = e.target.textContent;
    localStorage["select-transportation"] = e.target.textContent;
  });
  createDropdownEvents("select-time", function(e) {
    document.querySelector("#select-time>div>div").textContent = e.target.textContent;
    document.querySelector("#statement-time").textContent = e.target.textContent;
    localStorage["select-time"] = e.target.textContent;
  });
  createDropdownEvents("select-location", function(e) {
    document.querySelector("#select-location>div>div").textContent = e.target.textContent;
    document.querySelector("#statement-location").textContent = e.target.textContent;
    localStorage["select-location"] = e.target.textContent;
  });
  createDropdownEvents("select-date", function(e) {
    document.querySelector("#select-date>div>div").textContent = e.target.textContent;
    document.querySelector("#statement-date").textContent = e.target.textContent;
    localStorage["select-date"] = e.target.textContent;
  });
})();


// Voting place selection
// function loadGAPI() {
//   gapi.client.setApiKey("AIzaSyBNWmDwDM49_L2RmNyRVX6veBXneKEGNF4");
//   lookup('1263 Pacific Ave. Kansas City KS', renderResults);
// }

// function lookup(address, callback) {
//   var electionId = 2000;
//   var req = gapi.client.request({
//     // "path" : "/civicinfo/v2/elections"
//     "path" : "/civicinfo/v2/voterinfo",
//     "params" : {"electionId" : electionId, "address" : address}
//   });

//   req.execute(callback);
// }

// function renderResults(response, rawResponse) {
//   var polls = response.pollingLocations;
//   for (let i = 0; i < polls.length; i++) {
//     var address = Object.values(polls[i].address);
//     var filtered = address.filter(function(el) {
//       return el != "";
//     }).join(", ");
//     console.log(filtered);
//     console.log(polls[i].pollingHours);
//   }
// }


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