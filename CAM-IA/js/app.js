document.addEventListener("DOMContentLoaded", function () {
  // Detectar si el dispositivo es móvil para optimizar la experiencia AR
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Ajustar elementos de la UI según el dispositivo
  if (isMobile) {
    // No hacer nada especial por ahora, la página ya es responsive
  } else {
    // Añadir un mensaje para dispositivos de escritorio
    const arButton = document.querySelector(".btn-primary");
    if (arButton) {
      const originalHref = arButton.getAttribute("href");

      arButton.addEventListener("click", function (e) {
        e.preventDefault();

        // Mostrar una sugerencia para una mejor experiencia en móviles
        const useDesktop = confirm(
          "La experiencia de Realidad Aumentada es mejor en dispositivos móviles. ¿Deseas continuar de todos modos?"
        );

        if (useDesktop) {
          window.location.href = originalHref;
        }
      });
    }
  }

  // Configurar animaciones de entrada para las tarjetas de características
  const cards = document.querySelectorAll(".feature-cards .card");

  // Función para verificar si un elemento está visible en la pantalla
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Función para animar elementos cuando entran en la pantalla
  function animateOnScroll() {
    cards.forEach(card => {
      if (isElementInViewport(card)) {
        card.classList.add("animated");
      }
    });
  }

  // Inicializar al cargar y aplicar en el scrolling
  animateOnScroll();
  window.addEventListener("scroll", animateOnScroll);

  // Opcional: Mejorar el scroll suave para navegación interna
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      e.preventDefault();

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
