import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wifi, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } else {
      toast.error("Credenciais inválidas. Use a senha: 1234");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
            <Wifi className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Z3 Tech Fiber
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Plataforma de gestão de fibra óptica
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              type="email"
              placeholder="tecnico@techfiber.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-secondary border-border"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Senha
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-secondary border-border pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-medium"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Demo: qualquer email + senha <span className="font-mono text-foreground">1234</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
