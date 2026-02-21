import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DiagnosticsPage() {
    const clearLocalStorage = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        console.log("✅ localStorage limpiado");
        alert("✅ localStorage limpiado. Recarga la página.");
        window.location.href = "/login";
    };

    const viewLocalStorage = () => {
        const token = localStorage.getItem("auth_token");
        const user = localStorage.getItem("auth_user");

        console.clear();
        console.log("📦 localStorage actual:");
        console.log("auth_token:", token ? `✓ ${token.substring(0, 50)}...` : "✗ No existe");
        console.log("auth_user:", user ? `✓ ${user}` : "✗ No existe");

        alert(`auth_token: ${token ? "✓ Existe" : "✗ No existe"}\nauth_user: ${user ? "✓ Existe" : "✗ No existe"}\n\nRevisa la consola para más detalles.`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
            <Card className="w-full max-w-md border border-slate-700 bg-slate-800">
                <CardContent className="p-8 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">🔧 Diagnósticos</h1>
                        <p className="text-slate-400 text-sm">Herramientas para debuggear el login</p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={viewLocalStorage}
                            className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                        >
                            📦 Ver localStorage
                        </Button>
                        <p className="text-xs text-slate-400">Abre Console (F12) para ver los detalles</p>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                        <Button
                            onClick={clearLocalStorage}
                            className="w-full h-10 bg-red-500 hover:bg-red-600 text-white font-semibold"
                        >
                            🗑️ Limpiar localStorage
                        </Button>
                        <p className="text-xs text-slate-400 mt-2">Elimina datos corruptos y redirige a login</p>
                    </div>

                    <div className="bg-slate-700 rounded p-3 text-xs text-slate-300 space-y-2">
                        <p className="font-semibold text-slate-200">📋 Instrucciones:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Click "🗑️ Limpiar localStorage"</li>
                            <li>Se abre login automáticamente</li>
                            <li>Intenta login: jarrunategui / j05d4v1d17</li>
                            <li>Abre DevTools (F12) y ve Console</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

