/* Thank-you page. Fires no tracking event: the Lead event belongs to the submit,
   so a reload or a revisit here never counts a second lead. */
(function () {
  "use strict";
  var lead = {};
  try { lead = JSON.parse(sessionStorage.getItem("kp_lead") || "{}") || {}; } catch (e) { lead = {}; }

  var name = String(lead.first_name || "").trim().slice(0, 60);
  var title = document.getElementById("tyTitle");
  if (title) title.textContent = name ? "Thanks " + name + ", we’ve got your details." : "Thanks, we’ve got your details.";

  // Business hours in Melbourne: Monday to Friday, 9am to 5pm.
  var call = document.getElementById("tyCall");
  if (call) {
    var open = false;
    try {
      var parts = new Intl.DateTimeFormat("en-AU", {
        timeZone: "Australia/Melbourne", weekday: "short", hour: "numeric", hourCycle: "h23"
      }).formatToParts(new Date());
      var day = "", hour = 0;
      parts.forEach(function (p) {
        if (p.type === "weekday") day = p.value;
        if (p.type === "hour") hour = parseInt(p.value, 10);
      });
      open = ["Sat", "Sun"].indexOf(day) === -1 && hour >= 9 && hour < 17;
    } catch (e) { open = false; }
    call.textContent = open
      ? "Kien’s team will call you within 15 minutes."
      : "Kien’s team will call you from 9am.";
  }

  var note = document.getElementById("tySmsfNote");
  if (note && lead.page === "smsf" && lead.smsf_setup === "Not yet") note.hidden = false;
})();
