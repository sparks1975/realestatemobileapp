export function Footer() {
  return (
    <footer className="py-16" style={{ backgroundColor: 'var(--secondary-color)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <div 
            className="text-3xl font-light mb-8 tracking-wider"
            style={{ color: 'var(--tertiary-color)' }}
          >
            LUXELEAD
          </div>
          <div className="flex justify-center space-x-8 mb-8">
            <a 
              href="/" 
              className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'var(--tertiary-color)' }}
            >
              Home
            </a>
            <a 
              href="/properties" 
              className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'var(--tertiary-color)' }}
            >
              Properties
            </a>
            <a 
              href="/agent" 
              className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'var(--tertiary-color)' }}
            >
              Agent
            </a>
            <a 
              href="/#contact" 
              className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'var(--tertiary-color)' }}
            >
              Contact
            </a>
            <a 
              href="/admin" 
              className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'var(--tertiary-color)' }}
            >
              Admin
            </a>
          </div>
          <div className="flex justify-center space-x-6 mb-8">
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">f</span>
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">t</span>
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">in</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            © 2024 LuxeLead. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}