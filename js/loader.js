// Crear e insertar el loader
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.innerHTML = `
      <div class="loader-circle">
        <img src="${location.pathname.includes('/pages/') ? '../' : ''}assets/drinksito_logo.png" alt="Loader" />
      </div>
    `;
    document.body.appendChild(loader);

    // Bloquear scroll mientras carga
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
});

// Función que se llamará desde otro módulo para ocultar el loader
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
