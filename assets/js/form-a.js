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
    // Not connected yet: when it is, the record goes to /api/submit-lead here (see lead.js).
    setTimeout(function () { showDone(rec.first_name, true); }, REDUCE ? 0 : 450);
  });

  /* ---------- done: the form card turns into a thank-you, then the page moves on ---------- */
  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showDone(firstName, thenScroll) {
    var card = form.closest(".form-card");
    if (!card) return;
    card.textContent = "";
    card.classList.add("is-done");

    var done = document.createElement("div");
    done.className = "form-done";
    done.setAttribute("role", "status");

    var tick = document.createElement("span");
    tick.className = "quiz-done__tick";
    tick.setAttribute("aria-hidden", "true");
    done.appendChild(tick);

    var title = document.createElement("h2");
    title.className = "form-card__title form-done__title";
    title.tabIndex = -1;
    title.textContent = firstName ? "Done, thank you " + firstName + "." : "Done, thank you.";
    done.appendChild(title);

    var text = document.createElement("p");
    text.className = "form-done__text";
    text.textContent = "We’ve got your details. Kien’s team will call you within 15 minutes in business hours to set up your free 45-minute strategy session.";
    done.appendChild(text);

    var next = document.getElementById("next");
    if (next) {
      var more = document.createElement("a");
      more.className = "link-arrow form-done__more";
      more.href = "#next";
      more.textContent = "Keep reading ";
      var arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↓";
      more.appendChild(arrow);
      done.appendChild(more);
    }

    card.appendChild(done);
    title.focus({ preventScroll: true });

    // After a moment to read it, glide down to the rest of the page.
    if (thenScroll && next) {
      setTimeout(function () {
        next.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
      }, REDUCE ? 1500 : 2600);
    }
  }

  // Arriving from the quiz: the details are already in, so there is no form to fill.
  if (new URLSearchParams(window.location.search).get("from") === "quiz") showDone("", false);
})();
