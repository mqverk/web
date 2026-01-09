// import "aos/dist/aos.css";
import "../style.css";

import { gsap } from "gsap";

import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

let namel = SplitText.create("#namel", {
  type: "chars",
});

let els = [];

namel.chars.forEach((el, idx) => {
  if (idx % 2 == 0) {
    gsap.set(el, { y: window.innerHeight - el.clientHeight });
    els.push(el);
  } else {
    // el.style.position = "fixed"
  }
});
window.onload = () => {
  let tl = gsap.timeline();
  els.forEach((el, idx) => {
    tl.to(
      el,
      {
        delay: 1,
        y: 0,
        duration: 1,
      },
      0
    );
  });

  tl.to(
    ".loader",
    {
      delay: 1,
      "--clip": "0%",
      duration: 1.33,
    },
    0.33
  );
};
