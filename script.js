// Code by Cameron Samuels


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
  createDropdownEvents("select-date", function(e) {
    document.querySelector("#select-date>div>div").textContent = e.target.textContent;
    document.querySelector("#statement-date").textContent = e.target.textContent;
  });
  createDropdownEvents("select-id", function(e) {
    document.querySelector("#select-id>div>div").textContent = e.target.textContent;
    document.querySelector("#statement-id").textContent = e.target.textContent;
  });
})();


// Voting place selection
function loadGAPI() {
  gapi.client.setApiKey("AIzaSyBNWmDwDM49_L2RmNyRVX6veBXneKEGNF4");
  lookup('1263 Pacific Ave. Kansas City KS', renderResults);
}

function lookup(address, callback) {
  /**
  * Election ID for which to fetch voter info.
  * @type {number}
  */
  var electionId = 2000;

  /**
  * Request object for given parameters.
  * @type {gapi.client.HttpRequest}
  */
  var req = gapi.client.request({
    "path" : "/civicinfo/v2/elections"
    // "path" : "/civicinfo/v2/voterinfo",
    // "params" : {"electionId" : electionId, "address" : address}
  });

  req.execute(callback);
}

function renderResults(response, rawResponse) {
  console.log(response);
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
