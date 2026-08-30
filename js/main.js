(function () {
  var form = document.getElementById("support-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var status = document.getElementById("support-status");
    if (!status) return;
    status.hidden = false;
    status.textContent =
      "Not sent. Support wiring lands after this site is published.";
  });
})();
