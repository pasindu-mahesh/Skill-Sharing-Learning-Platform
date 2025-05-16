import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import supabase from "@/lib/supabaseClient";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold gradient-text">Photogram</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/explore" className="text-foreground/80 hover:text-primary transition-colors">
            Explore
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
            About
          </Link>          {user ? (
            <div className="flex items-center gap-4">
              <Button variant="secondary" onClick={handleSignOut} className="flex items-center gap-1 hover:text-primary">
                <LogOut size={16} />
                Sign out
              </Button>
              <Button variant="ghost" onClick={() => navigate("/profile")}>
                <User size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="text-foreground/80 hover:text-primary py-2 transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="text-foreground/80 hover:text-primary py-2 transition-colors"
              onClick={toggleMenu}
            >
              Explore
            </Link>
            <Link
              to="/about"
              className="text-foreground/80 hover:text-primary py-2 transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>

            {user ? (              <div className="flex flex-col gap-2 pt-2 border-t">
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2 hover:text-primary"
                  onClick={() => {
                    toggleMenu();
                    handleSignOut();
                  }}
                >
                  <LogOut size={16} />
                  Sign out
                </Button>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    toggleMenu();
                    navigate("/profile");
                  }}
                >
                  <User size={20} />
                  Profile
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" onClick={toggleMenu}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
