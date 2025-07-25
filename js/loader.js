document.addEventListener("DOMContentLoaded", () => {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.innerHTML = `
      <div class="loader-circle">
        <img src="${location.pathname.includes('/pages/') ? '../' : ''}assets/drinksito_logo.png" alt="Loader" />
      </div>
    `;
    document.body.appendChild(loader);

  
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
});

export function ocultarLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;

    const tiempoTransicion = 600;
    loader.classList.add("oculto");

    setTimeout(() => {
        loader.remove();
        document.body.style.overflow = "";
        document.body.style.height = "";
    }, tiempoTransicion);
}

export function mostrarLoader() {
  if (document.getElementById("loader")) return;

  const loader = document.createElement("div");
  loader.id = "loader";
  loader.innerHTML = `
    <div class="loader-circle">
      <img src="${location.pathname.includes('/pages/') ? '../' : ''}assets/drinksito_logo.png" alt="Loader" />
    </div>
  `;
  document.body.appendChild(loader);

  document.body.style.overflow = "hidden";
  document.body.style.height = "100vh";
}
