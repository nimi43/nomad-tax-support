import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, MessageCircle, Globe, Mail } from "lucide-react";

const Login = () => {
  const [userCredentials, setUserCredentials] = useState({ email: "", password: "" });
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock user authentication - in real app would validate against backend
    if (userCredentials.email && userCredentials.password) {
      localStorage.setItem("userType", "user");
      localStorage.setItem("userEmail", userCredentials.email);
      navigate("/user-dashboard");
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded admin credentials as requested
    if (adminCredentials.username === "admin" && adminCredentials.password === "admin123") {
      localStorage.setItem("userType", "admin");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google OAuth - in real app would integrate with Google OAuth
    localStorage.setItem("userType", "user");
    localStorage.setItem("userEmail", "user@gmail.com");
    navigate("/user-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Work Buddy</h1>
          </div>
          <p className="text-blue-100">Your trusted partner for overseas support</p>
        </div>

        <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Choose your login type to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  User
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4">
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="Enter your email"
                      value={userCredentials.email}
                      onChange={(e) => setUserCredentials({ ...userCredentials, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      placeholder="Enter your password"
                      value={userCredentials.password}
                      onChange={(e) => setUserCredentials({ ...userCredentials, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" variant="gradient">
                    <Globe className="w-4 h-4" />
                    Login as User
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleLogin}
                >
                  <Mail className="w-4 h-4" />
                  Continue with Gmail
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Username</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="admin"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="admin123"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" variant="secondary">
                    <Shield className="w-4 h-4" />
                    Login as Admin
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground text-center">
                  Default credentials: admin / admin123
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;