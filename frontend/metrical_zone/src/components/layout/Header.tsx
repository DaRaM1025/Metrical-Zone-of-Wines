import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo con tipografía llamativa: verde y morado */}
        <Link to="/" className="text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-green-400 to-purple-600 bg-clip-text text-transparent">
            WineApp
          </span>
        </Link>

        {/* Navegación derecha */}
        <nav className="space-x-6">
          <Link
            to="/#region-search"
            className="text-gray-200 hover:text-green-400 transition-colors"
          >
            Regiones
          </Link>
          <Link
            to="/vineyards"
            className="text-gray-200 hover:text-green-400 transition-colors"
          >
            Viñedos
          </Link>
        </nav>
      </div>
    </header>
  );
}
