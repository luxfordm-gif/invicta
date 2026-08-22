/* forms.js — submission behaviour for the two enquiry forms.

   Both post to Netlify Forms:
     • "contact"  — the full-page form on /contact/
     • "enquiry"  — the slide-out drawer, present on every page

   Both are submitted over fetch and confirm in place. Neither navigates away:
   sending an enquiry is a small event, and a full-page takeover for it both
   overstates the moment and throws away the context the visitor was in. On the
   contact page the details and map stay exactly where they were, which is the
   reassuring part. With JavaScript off, both fall back to a plain POST and
   Netlify's redirect to /thank-you/, which is why that page still exists.

   Netlify treats a field named "subject" as the notification email's subject
   line, so we rewrite it with the sender's name and town. That is what the
   client sees in their inbox, and it is the difference between four identical
   "Website enquiry" emails and four they can triage at a glance. */
(function () {
  "use strict";

  var ENDPOINT = "/";           // any static path works; Netlify matches on form-name
  var FADE = 280;               // must match the CSS opacity transition

  /* The number lives in site.json and reaches us on the drawer, which every page
     carries. Hardcoding it here would leave these two confirmations as the only
     place on the site that would not follow if the client ever changed it. */
  var drawerEl = document.querySelector("[data-enquiry]");
  var PHONE_TEXT = (drawerEl && drawerEl.getAttribute("data-phone")) || "07970 154529";
  var PHONE_HREF = "tel:" + ((drawerEl && drawerEl.getAttribute("data-tel")) || "+447970154529");

  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function value(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el && el.value ? el.value.trim() : "";
  }

  function firstName(form) {
    var name = value(form, "name");
    return name ? name.split(" ")[0] : "";
  }

  /* "Website enquiry from Jane Smith, Horley" */
  function buildSubject(form) {
    var name = value(form, "name");
    var town = value(form, "location");
    if (!name) return "Website enquiry, Invicta Water Treatment";
    return "Website enquiry from " + name + (town ? ", " + town : "");
  }

  /* Fill the hidden fields Netlify reads, just before every submit, so the
     values always match what was actually typed. */
  function stampHiddenFields(form, page) {
    var subject = form.querySelector('[name="subject"]');
    if (subject) subject.value = buildSubject(form);
    var pageField = form.querySelector('[name="page"]');
    if (pageField && !pageField.value) pageField.value = page || location.pathname;
  }

  /* Shared confirmation copy. The name is set with textContent, so it can never
     inject markup however it was typed. */
  function confirmation(form, prefix) {
    var who = firstName(form);
    var wrap = document.createElement("div");
    wrap.className = prefix;
    wrap.setAttribute("tabindex", "-1");
    wrap.setAttribute("role", "status");

    var eyebrow = document.createElement("p");
    // motion.css holds ".section .eyebrow" at opacity 0 until motion.js marks it
    // in, and motion.js only observes what was on the page at load. Without
    // is-in this would sit invisible but still taking up space, pushing the
    // title down and out of line with the details alongside it.
    eyebrow.className = "eyebrow is-in";
    eyebrow.textContent = "Enquiry received";
    wrap.appendChild(eyebrow);

    var title = document.createElement("h2");
    title.className = prefix + "__title";
    title.appendChild(document.createTextNode("Thank you"));
    if (who) {
      title.appendChild(document.createTextNode(", "));
      var em = document.createElement("span");
      em.className = "em";
      em.textContent = who;
      title.appendChild(em);
    }
    title.appendChild(document.createTextNode("."));
    wrap.appendChild(title);

    var rule = document.createElement("div");
    rule.className = "rule";
    wrap.appendChild(rule);

    var lead = document.createElement("p");
    lead.className = prefix + "__lead";
    lead.textContent =
      "Your enquiry is with us and will be read personally. We usually reply " +
      "within a working day.";
    wrap.appendChild(lead);

    var note = document.createElement("p");
    note.className = prefix + "__note";
    note.innerHTML =
      "If your supply has been cut off and you need us sooner, please call " +
      '<a href="' + PHONE_HREF + '">' + PHONE_TEXT + "</a>, our 24-hour line.";
    wrap.appendChild(note);

    return wrap;
  }

  /* Post the form and hand back to the caller. Errors keep everything the
     visitor typed, and offer the phone as the way through. */
  function submitOverFetch(form, opts) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (opts.clearError) opts.clearError();
      stampHiddenFields(form, opts.page);

      var button = form.querySelector('button[type="submit"]');
      var label = button ? button.innerHTML : "";
      if (button) {
        button.disabled = true;
        button.innerHTML = "Sending…";
      }

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Netlify returned " + res.status);
          opts.onSuccess();
        })
        .catch(function () {
          if (button) {
            button.disabled = false;
            button.innerHTML = label;
          }
          opts.onError(
            "Sorry, that did not send. Please try again, or call us on " +
              '<a href="' + PHONE_HREF + '">' + PHONE_TEXT + "</a> and we will pick it up straight away."
          );
        });
    });
  }

  /* Insert or update an inline error message under the submit row. */
  function errorHandles(form, className, anchorSelector) {
    var node = null;
    return {
      show: function (message) {
        if (!node) {
          node = document.createElement("p");
          node.className = className;
          node.setAttribute("role", "alert");
          var anchor = form.querySelector(anchorSelector);
          if (anchor) anchor.insertAdjacentElement("afterend", node);
          else form.appendChild(node);
        }
        node.innerHTML = message;
      },
      clear: function () {
        if (node && node.parentNode) node.parentNode.removeChild(node);
        node = null;
      },
    };
  }

  // ---------------------------------------------------------------- contact
  // The form column becomes the confirmation. The heading above it ("Send an
  // enquiry") goes too: it would be describing something that is no longer
  // there. The details aside and the map are deliberately left alone.
  var contact = document.querySelector('form[name="contact"]');
  var column = document.querySelector(".contact-body__main");
  if (contact && column) {
    var contactError = errorHandles(contact, "contact-form__error", ".contact-form__submit");
    submitOverFetch(contact, {
      page: "/contact/",
      clearError: contactError.clear,
      onError: contactError.show,
      onSuccess: function () {
        var sent = confirmation(contact, "contact-sent");
        var slow = !reduced();
        column.classList.add("is-clearing");
        setTimeout(function () {
          column.innerHTML = "";
          column.appendChild(sent);
          column.classList.remove("is-clearing");
          sent.focus({ preventScroll: true });
          sent.scrollIntoView({ block: "center", behavior: slow ? "smooth" : "auto" });
        }, slow ? FADE : 0);
      },
    });
  }

  // ---------------------------------------------------------------- drawer
  var drawer = drawerEl;
  var form = drawer && drawer.querySelector('form[name="enquiry"]');
  if (!form) return;

  var placeholder = document.createComment("enquiry form");
  var drawerError = errorHandles(form, "enquiry__error", ".enquiry__submit-row");

  submitOverFetch(form, {
    clearError: drawerError.clear,
    onError: drawerError.show,
    onSuccess: function () {
      var inner = drawer.querySelector(".enquiry__inner");
      var scroll = drawer.querySelector(".enquiry__scroll");
      var slow = !reduced();

      // The panel stops being an enquiry form and becomes a confirmation: the
      // header retires so the thank-you takes the title's place at the top.
      // Leaving it up made the change too quiet to notice, since the only thing
      // that moved was below where the eye was resting.
      inner.classList.add("is-clearing");
      setTimeout(function () {
        var sent = confirmation(form, "enquiry-sent");
        sent.setAttribute("data-enquiry-view", "form");   // so the tabs keep toggling it

        var actions = document.createElement("p");
        actions.className = "enquiry-sent__actions";
        var close = document.createElement("button");
        close.type = "button";
        close.className = "btn-inquiry btn-inquiry--lg";
        // Same drawn arrow the templates use, so the one button this file
        // builds does not end up the only glyph arrow left on the site.
        close.innerHTML = 'Close <span class="btn-inquiry__arrow" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
        // enquiry.js bound its close handlers at load, so route through the
        // existing control rather than duplicating close and scroll-unlock here.
        close.addEventListener("click", function () {
          var x = drawer.querySelector(".enquiry__close");
          if (x) x.click();
        });
        actions.appendChild(close);
        sent.appendChild(actions);

        // Keep the form so a second enquiry is possible after the drawer closes.
        form.parentNode.insertBefore(placeholder, form);
        form.parentNode.replaceChild(sent, form);
        inner.classList.add("is-sent");
        if (scroll) scroll.scrollTop = 0;
        inner.classList.remove("is-clearing");
        sent.focus({ preventScroll: true });
      }, slow ? FADE : 0);
    },
  });

  /* Put the pristine form back once the drawer has closed, so reopening it does
     not strand the visitor on a stale confirmation. enquiry.js fires this. */
  document.addEventListener("enquiry:closed", function () {
    if (!placeholder.parentNode) return;
    var sent = placeholder.nextElementSibling;
    var inner = drawer.querySelector(".enquiry__inner");
    inner.classList.remove("is-sent", "is-clearing");     // bring the header back
    form.reset();
    drawerError.clear();
    // Inherit the confirmation's visibility, so the form comes back on whichever
    // tab the visitor left the drawer on.
    form.hidden = sent ? sent.hidden : false;
    placeholder.parentNode.insertBefore(form, placeholder);
    placeholder.parentNode.removeChild(placeholder);
    if (sent && sent.classList.contains("enquiry-sent")) sent.remove();
  });
})();
