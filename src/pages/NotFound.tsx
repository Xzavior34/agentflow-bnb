import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.warn("404 Not Found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
          <Cpu className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-4xl font-bold font-mono text-foreground mb-2">404</h1>
        <h2 className="text-lg font-semibold mb-2">Page Not Found</h2>
        <p className="text-xs text-muted-foreground mb-6 font-mono">
          The requested path <code className="text-amber-400">{location.pathname}</code> does not exist on AgentFlow.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs font-semibold">
            <Link to="/agents">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Explore Agents
            </Link>
          </Button>
          <Button asChild variant="outline" className="font-mono text-xs border-border">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
