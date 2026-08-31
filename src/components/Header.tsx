import { Link, useLocation } from 'react-router-dom';
import { Wallet, Cpu, Menu, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVE_NETWORK } from '@/config/networks';

export function Header() {
  const location = useLocation();
  const { address, balance, isConnected, isConnecting, connect, disconnect, isCorrectNetwork } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/agents', label: 'Explore' },
    { path: '/categories/rebalancing', label: 'Categories' },
    { path: '/compare', label: 'Compare' },
    { path: '/how-it-works', label: 'How It Works' },
  ];

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatBalance = (bal: string) => parseFloat(bal).toFixed(4);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center transition-all group-hover:border-amber-400 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.25)]">
            <Cpu className="w-5 h-5 text-amber-400" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Agent<span className="text-amber-400">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path.startsWith('/categories') && location.pathname.startsWith('/categories'));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-md font-mono text-xs transition-all ${
                  isActive
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action / Wallet Area */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/60 border border-border text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold">{formatBalance(balance)}</span>
                <span className="text-muted-foreground">{ACTIVE_NETWORK.nativeCurrency.symbol}</span>
                <span className="text-border">|</span>
                <span className="text-muted-foreground">{formatAddress(address!)}</span>
              </div>

              {!isCorrectNetwork && (
                <span className="text-xs text-amber-400 px-2 py-1 bg-amber-400/10 rounded border border-amber-400/30 font-mono">
                  Wrong Network
                </span>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="font-mono text-xs h-8 border-border hover:border-destructive hover:text-destructive"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={connect}
              disabled={isConnecting}
              size="sm"
              className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs font-semibold h-8 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
            >
              <Wallet className="w-3.5 h-3.5 mr-1.5" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-md font-mono text-sm transition-all ${
                    location.pathname === link.path
                      ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isConnected && (
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <div className="font-mono text-xs">
                    <p className="text-amber-400 font-bold">{formatBalance(balance)} {ACTIVE_NETWORK.nativeCurrency.symbol}</p>
                    <p className="text-muted-foreground">{formatAddress(address!)}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={disconnect} className="text-xs font-mono h-7">
                    Disconnect
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
