/* Version A: the full form beside the headline. */
(function () {
  "use strict";
  var form = document.getElementById("leadForm");
  if (!form || !window.KPLead) return;
  var L = window.KPLead;
  var status = form.querySelector("[data-form-status]");

  // The form never carries anything over from the quiz: it always opens empty.
  // (Clear any answers an earlier version of the quiz may have left in this tab.)
  try { sessionStorage.removeItem("kp_prefill"); } catch (e) { /* storage blocked: nothing to clear */ }
  // Coming back to this page with the browser's Back button must not show old answers either.
  window.addEventListener("pageshow", function (e) { if (e.persisted) form.reset(); });

  function fieldOf(name) {
    var el = form.elements[name];
    return el && el.closest ? el.closest(".f") : null;
  }

  function setError(name, msg) {
    var f = fieldOf(name);
    if (!f) return;
    f.classList.toggle("is-error", Boolean(msg));
    var err = f.querySelector(".f__error");
    if (msg) {
      if (!err) {
        err = document.createElement("span");
        err.className = "f__error";
        f.appendChild(err);
      }
      err.textContent = msg;
    } else if (err) {
      err.remove();
    }
  }

  form.addEventListener("input", function (e) {
    if (e.target && e.target.name) setError(e.target.name, "");
  });
  form.addEventListener("change", function (e) {
    if (e.target && e.target.name) setError(e.target.name, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    if (!form.reportValidity()) return;

    var mobile = form.elements.mobile.value;
    if (!L.isAuMobile(mobile)) {
      setError("mobile", "Please enter an Australian mobile, for example 0412 345 678.");
      form.elements.mobile.focus();
      return;
    }
    if (form.elements._gotcha && form.elements._gotcha.value) return;

    var page = form.dataset.page;
    var rec = L.blankRecord(page, "a", "full_form");
    var data = new FormData(form);
    data.forEach(function (v, k) {
      if (k in rec && typeof v === "string") rec[k] = v.trim();
    });

    if (page === "smsf") {
      // SMSF goal also fills today's purpose field.
      rec.enquiry_type = rec.smsf_goal === "Refinance my SMSF’s existing loan"
        ? L.PURPOSE.refinance : L.PURPOSE.commercial;
    }

    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.classList.add("is-loading");
    btn.setAttribute("aria-busy", "true");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(function () { L.submit(rec, form.dataset.thanks); }, reduce ? 0 : 450);
  });
})();
