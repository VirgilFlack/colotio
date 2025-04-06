
import { useState, useEffect } from 'react';
import { Menu, Search, Bell, PlusCircle, HelpCircle, Palette } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [logoColor, setLogoColor] = useState('gradient-blue-purple');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      setUserInitial(storedName.charAt(0).toUpperCase());
    }
    
    // Get the current theme color from localStorage
    const currentTheme = localStorage.getItem('colorTheme') || 'blue';
    
    // Map theme colors to logo gradient classes
    const themeToGradient = {
      'red': 'bg-gradient-to-r from-red-500 to-red-600',
      'orange': 'bg-gradient-to-r from-orange-500 to-orange-600',
      'yellow': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'green': 'bg-gradient-to-r from-green-500 to-green-600',
      'blue': 'bg-gradient-blue-purple', // Default
      'indigo': 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'violet': 'bg-gradient-to-r from-violet-500 to-violet-600',
      'pink': 'bg-gradient-to-r from-pink-500 to-pink-600',
      'teal': 'bg-gradient-to-r from-teal-500 to-teal-600'
    };
    
    setLogoColor(themeToGradient[currentTheme] || 'bg-gradient-blue-purple');
  }, []);

  const handleUserButtonClick = () => {
    navigate('/account');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/dashboard" className="text-lg font-medium hover:text-accent">Dashboard</Link>
                  <Link to="/data-input" className="text-lg font-medium hover:text-accent">Data Input</Link>
                  <Link to="/color-theory" className="text-lg font-medium hover:text-accent">Color Theory</Link>
                  <Link to="/help" className="text-lg font-medium hover:text-accent">Help</Link>
                  <Link to="/account" className="text-lg font-medium hover:text-accent">Account</Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-md ${logoColor} flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className={`text-xl font-bold ${logoColor} bg-clip-text text-transparent`}>Colotio</span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10 bg-secondary/50"
              placeholder="Search colors, dates..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isMobile && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/data-input" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Data Input
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/color-theory" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Color Theory
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help
                </Link>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2"
            onClick={handleUserButtonClick}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {userInitial || 'U'}
              </AvatarFallback>
            </Avatar>
            {userName && <span className="text-sm hidden sm:inline-block">{userName}</span>}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
