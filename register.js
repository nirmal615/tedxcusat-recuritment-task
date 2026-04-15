const registerForm = document.querySelector("#registerForm");
const formMessage = document.querySelector("#formMessage");

// Form Validation
function validateForm(formData) {
  const errors = [];

  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.push("Please enter a valid name (at least 2 characters)");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.push("Please enter a valid email address");
  }

  // Phone validation (basic)
  const phoneRegex = /^[0-9\-\+\(\)\s]{7,}$/;
  if (!phoneRegex.test(formData.phone)) {
    errors.push("Please enter a valid phone number");
  }

  // Interest validation
  if (!formData.interest || formData.interest.trim().length < 10) {
    errors.push("Please tell us why you want to attend (at least 10 characters)");
  }

  return errors;
}

if (registerForm && formMessage) {
  // Real-time validation feedback
  const inputs = registerForm.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      const field = input.closest(".field");
      if (field) {
        if (input.value.trim() === "") {
          field.classList.add("error");
        } else {
          field.classList.remove("error");
        }
      }
    });
  });

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Collect form data
    const formData = {
      name: document.querySelector("#name").value,
      email: document.querySelector("#email").value,
      phone: document.querySelector("#phone").value,
      tickets: document.querySelector("#tickets").value,
      interest: document.querySelector("#interest").value
    };

    // Validate form
    const errors = validateForm(formData);

    if (errors.length > 0) {
      // Show errors
      formMessage.innerHTML = `<span style="color: #ff6b6b;">⚠ ${errors.join("<br>")}</span>`;
      return;
    }

    // Trigger haptic feedback if available
    if (typeof window.triggerUiFeedback === "function") {
      window.triggerUiFeedback({
        sound: {
          frequency: 660,
          duration: 0.08,
          volume: 0.04,
          type: "sine"
        },
        vibration: [18, 24, 18]
      });
    }

    // Show success message
    formMessage.innerHTML = `
      <span style="color: #4ade80;">
        ✓ Registration successful!<br>
        <small style="color: #b8b8b8; margin-top: 8px; display: block; font-weight: 400;">
          Thank you ${formData.name.split(" ")[0]}! We'll see you at TEDx CUSAT 2026.<br>
          A confirmation email will be sent to ${formData.email}
        </small>
      </span>
    `;

    registerForm.style.opacity = "0.6";
    registerForm.style.pointerEvents = "none";

    // Reset after 3 seconds
    setTimeout(() => {
      registerForm.reset();
      registerForm.style.opacity = "1";
      registerForm.style.pointerEvents = "auto";
      formMessage.textContent = "";
    }, 3000);
  });
}

// Auto-focus first field
window.addEventListener("load", () => {
  const firstField = registerForm?.querySelector("input");
  if (firstField) {
    firstField.focus();
  }
});

