
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

const Welcome = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    // Save user name to localStorage
    localStorage.setItem("userName", userName.trim());
    
    // Navigate to main dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-in fade-in duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to Colotio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                What's your name?
              </label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Get Started
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Your personalized color collection journey begins here
        </CardFooter>
      </Card>
    </div>
  );
};

export default Welcome;
