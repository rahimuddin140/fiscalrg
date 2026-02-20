const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const revealItems = document.querySelectorAll(".reveal");
const faqButtons = document.querySelectorAll(".faq-q");
const emiForm = document.getElementById("emiForm");
const emiResult = document.getElementById("emiResult");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const zaimuLauncher = document.getElementById("zaimuLauncher");

menuBtn.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

faqButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((faq) => {
      faq.classList.remove("open");
      faq.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

emiForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(document.getElementById("loanAmount").value);
  const annualRate = Number(document.getElementById("loanRate").value);
  const years = Number(document.getElementById("loanYears").value);

  if (!amount || !annualRate || !years || amount <= 0 || annualRate <= 0 || years <= 0) {
    emiResult.textContent = "Please enter valid positive values.";
    return;
  }

  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  const emi =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  emiResult.textContent = `Estimated EMI: $${emi.toFixed(2)} / month`;
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name.length < 2) {
    formMessage.textContent = "Please enter a valid name.";
    formMessage.style.color = "#c62828";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.style.color = "#c62828";
    return;
  }

  if (message.length < 10) {
    formMessage.textContent = "Message should be at least 10 characters.";
    formMessage.style.color = "#c62828";
    return;
  }

  formMessage.textContent = "Message sent successfully. We will contact you soon.";
  formMessage.style.color = "#0f9d58";
  contactForm.reset();
});

let zaimuLoaded = false;

zaimuLauncher.addEventListener("click", () => {
  if (!zaimuLoaded) {
    loadZaimuAI();
    zaimuLoaded = true;
    zaimuLauncher.textContent = "Zaimu AI Loaded";
  }

  // Opens Botpress webchat if script loaded.
  if (window.botpress?.open) {
    window.botpress.open();
  }
});

function loadZaimuAI() {
  const script = document.createElement("script");
  script.src = "https://cdn.botpress.cloud/webchat/v2/inject.js";
  script.async = true;

  script.onload = () => {
    if (!window.botpress?.init) {
      return;
    }

    window.botpress.init({
      botId: "YOUR_BOTPRESS_BOT_ID",
      clientId: "YOUR_BOTPRESS_CLIENT_ID",
      selector: "#zaimuChatContainer",
      configuration: {
        botName: "Zaimu AI",
        color: "#069BAD",
        variant: "solid",
        radius: 1,
        themeMode: "light",
        fontFamily: "Manrope"
      }
    });
  };

  document.body.appendChild(script);
}
