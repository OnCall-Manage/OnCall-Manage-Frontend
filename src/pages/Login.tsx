import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        console.log("🔐 Formulario enviado - Email:", email);

        try {
            console.log("⏳ Esperando respuesta de login...");
            await login(email, password);
            console.log("✅ Login exitoso - Redirigiendo a /");
            navigate("/", { replace: true });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
            console.error("❌ Error en login:", errorMessage);
            setError(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <Card className="w-full max-w-md border border-slate-700 shadow-2xl bg-slate-800">
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="p-8 border-b border-slate-700 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Database className="h-6 w-6 text-cyan-500" />
                            <h1 className="text-2xl font-semibold text-white">DBA On-Call Manager</h1>
                        </div>
                        <p className="text-sm text-slate-400">Sign in to manage your on-call schedule</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-3">
                            <label htmlFor="email" className="block text-sm font-semibold text-white">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="password" className="block text-sm font-semibold text-white">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-400 bg-red-900/30 border border-red-700/50 rounded p-3">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-base rounded transition-colors mt-4"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
