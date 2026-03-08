export function handleSessionExpired(): void {
    // Limpiar localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    // Llamar a la función de logout del contexto si está disponible
    if ((window as any).__authLogout) {
        (window as any).__authLogout();
    }

    // Usar navigate si está disponible, sino usar location.href
    if ((window as any).__navigate) {
        (window as any).__navigate("/login");
    } else {
        // Forzar recarga para limpiar estado en memoria
        window.location.href = "/login";
    }

    // Disparar evento personalizado para que los componentes reaccionen
    window.dispatchEvent(new CustomEvent("sessionExpired"));
}

