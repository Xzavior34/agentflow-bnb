import { Link } from 'react-router-dom';
import { Shield, Cpu, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 text-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Agent<span className="text-amber-400">Flow</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Discover, compare and hire autonomous agents across BNB Chain's onchain agent economy.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>BNB Smart Chain Active</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">First-Class Categories</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/categories/rebalancing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Rebalancing
                </Link>
              </li>
              <li>
                <Link to="/categories/grid-trading" className="text-muted-foreground hover:text-foreground transition-colors">
                  Grid Trading
                </Link>
              </li>
              <li>
                <Link to="/categories/yield-optimisation" className="text-muted-foreground hover:text-foreground transition-colors">
                  Yield Optimisation
                </Link>
              </li>
              <li>
                <Link to="/categories/health-factor" className="text-muted-foreground hover:text-foreground transition-colors">
                  Health Factor Monitoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">Platform Architecture</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/agents" className="text-muted-foreground hover:text-foreground transition-colors">
                  Explore Marketplace
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
                  Compare Agents
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/agents/97/2032" className="text-muted-foreground hover:text-foreground transition-colors">
                  SafeHire ProofOps Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Evidence & Protocol Links */}
          <div>
            <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">Onchain & Protocol Standards</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://8004scan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  8004scan Registry <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://testnet.bscscan.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  BscScan Testnet <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://bnbchain.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  BNB Chain Ecosystem <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AgentFlow. Built for the BNB Chain Autonomous Agent Economy.</p>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Synthetic Production Data · Deterministic Onchain Provenance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
