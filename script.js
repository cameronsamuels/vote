// Code by Cameron Samuels


// Countdown
(function() {
  var el = document.querySelector("#countdown");
  var d = new Date("October 5, 2020 11:59:59") - new Date();
  el.textContent = "The deadline to register to vote in Texas is in " + Math.floor(d / 86400000) + " days";
})();


// Voting method selection
(function() {
  function selectVoteMethod() {
    var absentee = document.querySelector("#vote-by-mail").checked;
    var els = document.querySelectorAll(".absentee");
    for (let i = 0; i < els.length; i++)
      els[i].style.display = absentee ? "" : "none";
    els = document.querySelectorAll(".appearance");
    for (let i = 0; i < els.length; i++)
      els[i].style.display = absentee ? "none" : "";
  }
  document.querySelector("#vote-in-person").addEventListener("change", selectVoteMethod);
  document.querySelector("#vote-by-mail").addEventListener("change", selectVoteMethod);
})();


// Dropdown selections
(function() {
  function createDropdownEvents(dropdown, action) {
    var els = document.querySelectorAll("#" + dropdown + ">div>div>div");
    for (let i = 0; i < els.length; i++)
      els[i].addEventListener("click", action);
  }
  createDropdownEvents("select-id", function(e) {
    document.querySelector("#select-id>div>div").textContent = e.target.textContent;
    document.querySelector("#statement-id").textContent = e.target.textContent;
  });
})();


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
    el.addEventListener("click", function(e) {
      document.querySelector("#select-date>div>div").textContent = e.target.textContent;
      document.querySelector("#statement-date").textContent = e.target.textContent;
    });
    drop.appendChild(el);
  }
})();


// Voting place selection
function loadGAPI() {
  gapi.client.setApiKey("AIzaSyBNWmDwDM49_L2RmNyRVX6veBXneKEGNF4");
  lookup('1263 Pacific Ave. Kansas City KS', renderResults);
}

function lookup(address, callback) {
  var electionId = 2000;
  var req = gapi.client.request({
    // "path" : "/civicinfo/v2/elections"
    "path" : "/civicinfo/v2/voterinfo",
    "params" : {"electionId" : electionId, "address" : address}
  });

  req.execute(callback);
}

function renderResults(response, rawResponse) {
  var polls = response.pollingLocations;
  for (let i = 0; i < polls.length; i++) {
    var address = Object.values(polls[i].address);
    var filtered = address.filter(function(el) {
      return el != "";
    }).join(", ");
    console.log(filtered);
    console.log(polls[i].pollingHours);
  }
}


// Print statement
document.querySelector("#print-statement").addEventListener("click", function() {
  window.print();
});


// Add statement to calendar
function updateAddToCalendar() {
  var start = "20201103T073000Z";
  var end = "20201103T83000Z";
  var title = "Vote in the Election!";
  var location = "Polling Place";
  var details = "{voting statement}<br>View the voting checklist at <a href=\"https://cameronsamuels.com/vote\">cameronsamuels.com/vote</a>";

  function removeWhitespace(x) {
    while (x.includes(" "))
      x = x.replace(" ", "%20");
    return x;
  }
  title = removeWhitespace(title);
  location = removeWhitespace(location);
  details = removeWhitespace(details);

  var url = "http://www.google.com/calendar/event?action=TEMPLATE&dates=" + start + "%2F" + end + "&text=" + title + "&location=" + location + "&details=" + details;
  document.querySelector("#add-to-calendar").href = url;
}
