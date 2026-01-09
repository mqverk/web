import gsap from "gsap";
const boxes = document.querySelectorAll(".cursor .circle");
if (isMobile) {
  document.querySelector(".cursor").remove();
  window.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches[0].clientX !== undefined) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
} else {
  // Move all boxes toward the mouse position
  function moveBox(e) {
    boxes.forEach((box, index) => {
      gsap.to(box, {
        duration: 0.05,
        left: e.clientX + "px",
        top: e.clientY + "px",
        delay: index / 750,
      });
    });
  }

  // Listen for mousemove on the window
  window.addEventListener("mousemove", moveBox);
  // window.onscroll = moveBox;

  // Initial visibility
  boxes.forEach((box) => {
    gsap.set(box, { autoAlpha: 1, delay: 0 });
  });

  // Make the 30th .text visible
  const thirtiethText = document.querySelector(".text:nth-child(30)");
  if (thirtiethText) {
    gsap.set(thirtiethText, { autoAlpha: 1, delay: 0 });
  }
}
