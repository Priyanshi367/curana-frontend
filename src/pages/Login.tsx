import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logonew.png";
import hospitalBg from "@/assets/hospital-login-bg.jpg";
import { useState } from "react";
import { login as strapiLogin, getUserRole } from "@/services/auth";
import { getRoleDefaultRoute } from "@/services/roleDefaults";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await strapiLogin(email, password);
      
      // Get user role and redirect to role-specific default page
      const userRole = getUserRole();
      if (userRole) {
        const defaultRoute = await getRoleDefaultRoute(userRole);

        console.log(defaultRoute,userRole,'defaultRoutedefaultRoute')
        navigate(defaultRoute);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hospitalBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/70" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-card rounded-3xl shadow-elegant p-12 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Curana Hub" className="h-24 w-auto" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-semibold mb-3 text-foreground">
            Welcome to Curana Hub
          </h1>
          
          {/* Tagline */}
          <p className="text-muted-foreground mb-10 text-lg">
            Your digital workspace for collaboration, care, and connection.
          </p>

          {/* Sign In Button */}
          <form onSubmit={handleLogin} className="text-left">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity rounded-full"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-sm text-muted-foreground mt-12">
            © 2025 Curana Hub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
