window.addEventListener("load", async function () {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  await navigator.serviceWorker
    .register("./serviceworker.js")
    .catch(console.error);
});
