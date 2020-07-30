// Code by Cameron Samuels


// Voting method selection
(function(){
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


// Voting date selection
(function() {
  function selectVoteDate(e) {
    document.querySelector(".dropdown>div>div").textContent = e.target.textContent;
    document.querySelector("#statement-date").textContent = e.target.textContent;
  }
  var els = document.querySelectorAll(".dropdown>div>div>div");
  for (let i = 0; i < els.length; i++)
    els[i].addEventListener("click", selectVoteDate);
})();

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
