/* =========================
   1) VSL MODAL
========================= */
(() => {
  const modal = document.querySelector("[data-vsl-modal]");
  const openBtn = document.querySelector("[data-vsl-open]");
  const iframe = document.querySelector("[data-vsl-iframe]");
  const closeEls = document.querySelectorAll("[data-vsl-close]");

  if (!modal || !openBtn || !iframe) return;

  const originalSrc = iframe.getAttribute("src");

  const open = () => {
    modal.setAttribute("aria-hidden", "false");
    if (originalSrc && !originalSrc.includes("autoplay=1")) {
      const join = originalSrc.includes("?") ? "&" : "?";
      iframe.setAttribute("src", originalSrc + join + "autoplay=1");
    }
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.setAttribute("aria-hidden", "true");
    iframe.setAttribute("src", originalSrc);
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", open);
  closeEls.forEach(el => el.addEventListener("click", close));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();


/* =========================
   2) FORM -> MAKE WEBHOOK
========================= */
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/fyrb7mco3g4way5m8hy7tlqp71o9y32m";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.textContent : "Solicitar sesión";

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Enviando...";
    }

    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot anti-spam (bots suelen rellenar campos ocultos)
    if (data.company_website) {
      form.reset();
      if (btn) btn.textContent = "Redirigiendo a la agenda…";
      setTimeout(() => { window.location.href = "agenda.html"; }, 400);
      return;
    }
    delete data.company_website;

    try {
      const res = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error enviando");

      // OK
      form.reset();
      if (btn) btn.textContent = "Redirigiendo a la agenda…";

      // Opción recomendada: llevarlo a tu página premium agenda.html
      setTimeout(() => {
        window.location.href = "agenda.html";
      }, 700);

      // vuelve a dejar el botón normal tras 2s
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }, 2000);

    } catch (err) {
      console.error(err);
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
      }
      alert("No se pudo enviar. Prueba de nuevo en 10 segundos.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const calendlyButtons = document.querySelectorAll(".js-calendly");
  if (!calendlyButtons.length) return;

  calendlyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      Calendly.initPopupWidget({
        url: "https://calendly.com/aurumstudioghl/30min"
      });
    });
  });
});
