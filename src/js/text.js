// src/animations/textScramble.js
// import { animateText, assignAnimation } from "./textScrambleCore";

function animateText(element) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let revealIndex = 0;
  const originalText = element.dataset.text.split("");
  // const lines = originalText.split("<br>");

  const intervalId = setInterval(() => {
    element.innerText = originalText
      // lines
      // .map((line, lineIdx) =>
      // Array.from(line)
      .map((char, charIdx) => {
        // Exception: keep 🇧🇩 (Bangladesh flag emoji) intact
        if (char === " " || char === ":" || char === "&" || char === ",")
          return char;
        if (charIdx < revealIndex) return originalText[charIdx];
        return charset[Math.floor(Math.random() * charset.length)];
      })
      .join("");
    // )
    // Scale increases at start, peaks at middle, then decreases to normal at end
    // .join("<br>");
    if (revealIndex > originalText.length) {
      clearInterval(intervalId);
    }
    revealIndex += 1 / 2;
  }, 30);
}

function assignAnimation(selector) {
  document.querySelectorAll(selector).forEach((element) => {
    if (!element.dataset.text) {
      element.dataset.text = element.innerText;
    }
    element.onmouseover = () => animateText(element);

    // Animate when element scrolls into view
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateText(element);
            obs.unobserve(element);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(element);
  });
}

assignAnimation("main ul li");
assignAnimation(".about ul li");
assignAnimation(".about h2 span");
assignAnimation(".contact a");
