export function handleSessionExpired(): void {

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    if ((window as any).__authLogout) {
        (window as any).__authLogout();
    }

    if ((window as any).__navigate) {
        (window as any).__navigate("/login");
    } else {
        window.location.href = "/login";
    }
}

