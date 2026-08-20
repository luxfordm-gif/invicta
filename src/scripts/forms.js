/* forms.js — submission behaviour for the two enquiry forms.

   Both post to Netlify Forms:
     • "contact"  — the full-page form on /contact/. Plain HTML POST, so it works
                    with JavaScript switched off; Netlify redirects to /thank-you/.
     • "enquiry"  — the slide-out drawer, present on every page. Submitted over
                    fetch so the drawer can show its own confirmation in place
                    rather than navigating away mid-journey.

   Netlify treats a field named "subject" as the notification email's subject
   line, so we rewrite it with the sender's name and town. That is what the
   client sees in their inbox, and it is the difference between four identical
   "Website enquiry" emails and four they can triage at a glance. */
(function () {
  "use strict";

  var ENDPOINT = "/";           // any static path works; Netlify matches on form-name
  var PHONE_HREF = "tel:+447970154529";
  var PHONE_TEXT = "07970 154529";

  function value(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el && el.value ? el.value.trim() : "";
  }

  /* "Website enquiry from Jane Smith, Horley" */
  function buildSubject(form) {
    var name = value(form, "name");
    var town = value(form, "location");
    if (!name) return "Website enquiry, Invicta Water Treatment";
    return "Website enquiry from " + name + (town ? ", " + town : "");
  }

  /* Fill the hidden fields Netlify reads. Called just before every submit so the
     values always match what was actually typed. */
  function stampHiddenFields(form, page) {
    var subject = form.querySelector('[name="subject"]');
    if (subject) subject.value = buildSubject(form);
    var pageField = form.querySelector('[name="page"]');
    if (pageField && !pageField.value) pageField.value = page || location.pathname;
  }

  // ---------------------------------------------------------------- contact
  // Native POST: we only enrich the subject, then let the browser submit.
  var contact = document.querySelector('form[name="contact"]');
  if (contact) {
    contact.addEventListener("submit", function () {
      stampHiddenFields(contact, "/contact/");
    });
  }

  // ---------------------------------------------------------------- drawer
  var drawer = document.querySelector("[data-enquiry]");
  var form = drawer && drawer.querySelector('form[name="enquiry"]');
  if (!form) return;

  var placeholder = document.createComment("enquiry form");
  var status = null;

  function firstName(form) {
    var name = value(form, "name");
    return name ? name.split(" ")[0] : "";
  }

  function showStatus(message) {
    if (!status) {
      status = document.createElement("p");
      status.className = "enquiry__error";
      status.setAttribute("role", "alert");
      var row = form.querySelector(".enquiry__submit-row");
      if (row) row.insertAdjacentElement("afterend", status);
      else form.appendChild(status);
    }
    status.innerHTML = message;
  }

  function clearStatus() {
    if (status && status.parentNode) status.parentNode.removeChild(status);
    status = null;
  }

  function showSuccess() {
    var who = firstName(form).replace(/[<>&]/g, "");
    var success = document.createElement("div");
    success.className = "enquiry__success";
    success.setAttribute("tabindex", "-1");
    // Carries the form's view name so the drawer tabs keep toggling it correctly.
    success.setAttribute("data-enquiry-view", "form");
    success.innerHTML =
      "<h3>Thank you" + (who ? ", " + who : "") + ".</h3>" +
      "<p>Your enquiry is with us and will be read personally. We usually reply " +
      "within a working day. If your supply has been cut off and you need us sooner, " +
      'please call <a href="' + PHONE_HREF + '">' + PHONE_TEXT + "</a>, our 24-hour line.</p>";

    // Swap the form out but keep it, so a second enquiry is possible after close.
    form.parentNode.insertBefore(placeholder, form);
    form.parentNode.replaceChild(success, form);
    success.focus({ preventScroll: true });
  }

  /* Put the pristine form back once the drawer has closed, so reopening it does
     not strand the visitor on a stale confirmation. enquiry.js fires this. */
  document.addEventListener("enquiry:closed", function () {
    if (!placeholder.parentNode) return;
    var success = placeholder.nextElementSibling;
    form.reset();
    clearStatus();
    // Inherit the confirmation's visibility, so the form comes back on whichever
    // tab the visitor left the drawer on.
    form.hidden = success ? success.hidden : false;
    placeholder.parentNode.insertBefore(form, placeholder);
    placeholder.parentNode.removeChild(placeholder);
    if (success && success.classList.contains("enquiry__success")) success.remove();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearStatus();
    stampHiddenFields(form);

    var button = form.querySelector('button[type="submit"]');
    var label = button ? button.innerHTML : "";
    if (button) {
      button.disabled = true;
      button.innerHTML = "Sending…";
    }

    var restore = function () {
      if (!button) return;
      button.disabled = false;
      button.innerHTML = label;
    };

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Netlify returned " + res.status);
        showSuccess();
      })
      .catch(function () {
        restore();
        showStatus(
          "Sorry, that did not send. Please try again, or call us on " +
            '<a href="' + PHONE_HREF + '">' + PHONE_TEXT + "</a> and we will pick it up straight away."
        );
      });
  });
})();
