
import { useState, useEffect } from 'react';
import { Menu, Search, Bell, UserCircle, PlusCircle, Calendar } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [userName, setUserName] = useState('');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
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
                  <Link to="/calendar" className="text-lg font-medium hover:text-accent">Calendar</Link>
                  <Link to="/account" className="text-lg font-medium hover:text-accent">Account</Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-blue-purple flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline-block">Colotio</span>
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
                <Link to="/calendar" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/data-input" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Data Input
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
            <UserCircle className="h-5 w-5" />
            {userName && <span className="text-sm hidden sm:inline-block">{userName}</span>}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
