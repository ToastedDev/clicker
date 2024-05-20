const count = document.getElementById("count");

setInterval(() => {
  fetch("/clicks")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("count").textContent = data.clicks;
    });
}, 2000);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("increment").addEventListener("click", () => {
    fetch("/clicks", {
      method: "POST",
    });
  });
});
