const VITE_URL = import.meta.env.VITE_URL;
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    service: form.service.value,
    message: form.message.value,
  };
  const payload = {
    content: `New contact form submission:\nName: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\nMessage: ${data.message}`,
  };
  try {
    await fetch(VITE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    form.reset();
    alert("Message is sent! we will responce back soon");
  } catch {
    alert("Failed to send message.");
  }
});
