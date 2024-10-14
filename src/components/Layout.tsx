import { Link } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b w-full">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="flex-grow">
            <ul className="flex space-x-4">
              <li><Link to="/" className="text-foreground hover:text-primary">Encuesta</Link></li>
              <li><Link to="/results" className="text-foreground hover:text-primary">Resultados</Link></li>
            </ul>
          </nav>
          <ModeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;