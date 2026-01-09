import gsap from "gsap";

let setting = [80, 40];

document.querySelectorAll(".magnet").forEach((circle, idx) => {
  // const circle = document.querySelector(".magnet");
  const container = circle.parentElement;

  // const baseSize = 150;
  // const hoverSize = 200;

  container.addEventListener("mouseenter", () => {
    //   gsap.to(container, { width: hoverSize, height: hoverSize, duration: 0.3 });
    gsap.to(circle, { scale: 1.2, duration: 0.3 });
  });

  container.addEventListener("mouseleave", () => {
    //   gsap.to(container, { width: baseSize, height: baseSize, duration: 0.3 });
    gsap.to(circle, { scale: 1, x: 0, y: 0, duration: 0.3 });
  });

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const move = setting[idx]; // max movement in px

    const x = ((relX - rect.width / 2) / rect.width) * move;
    const y = ((relY - rect.height / 2) / rect.height) * move;

    gsap.to(circle, { x, y, duration: 0.3 });
  });
});
// const btn = document.querySelector(".magnet");
// const container = btn.parentElement;
// const strength = 100; // max offset in px

// container.addEventListener("mousemove", (e) => {
//   const rect = btn.getBoundingClientRect();
//   const centerX = rect.left + rect.width / 2;
//   const centerY = rect.top + rect.height / 2;

//   const deltaX = e.clientX - centerX;
//   const deltaY = e.clientY - centerY;

//   // clamp to a circle of radius `strength`
//   const distance = Math.min(Math.hypot(deltaX, deltaY), strength);
//   const angle = Math.atan2(deltaY, deltaX);
//   const x = Math.cos(angle) * distance;
//   const y = Math.sin(angle) * distance;

//   // tween toward the new position
//   gsap.to(btn, {
//     x,
//     y,
//     duration: 1,
//     // ease: "power3.out",
//   });
// });

// container.addEventListener("mouseleave", () => {
//   // return to center when leaving
//   gsap.to(btn, { x: 0, y: 0, duration: 1 });
// });
