// Show account ID when button of corresponding account is clicked
const showAccountIDButtons = document.querySelectorAll(".show-account-id");
showAccountIDButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.nextElementSibling.classList.toggle("hidden");
  });
});

const currentTime = new Date().getHours();
let greeting = "Good ";
if (currentTime < 12) {
  greeting += "Morning";
} else if (currentTime < 18) {
  greeting += "Afternoon";
} else {
  greeting += "Evening";
}
const greetingSpanElement = document.querySelector("#greeting");
greetingSpanElement.textContent = greeting;
