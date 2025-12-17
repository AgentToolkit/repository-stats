import { Package, Github } from 'lucide-react';
import Repository from '../types/repository';

interface NavbarProps {
  repositories: Repository[],
  activeRepository: Repository,
  handleSetActiveRepository: (repository: Repository) => void
}

const Navbar = ({ repositories, activeRepository, handleSetActiveRepository }: NavbarProps) => {

  return (
    <nav className="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-md flex items-center justify-center text-white font-bold text-lg">
            AT
          </div>
          <span className="font-bold text-xl tracking-tight text-[#f0f6fc]">Agent Toolkit Repository <span className="text-[#8b949e] font-normal">Analytics</span></span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="https://github.com/orgs/AgentToolkit/repositories" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#58a6ff] transition-colors">
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a href="https://pypi.org/user/agenttoolkit/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#58a6ff] transition-colors">
            <Package className="w-4 h-4" />
            <span>PyPI</span>
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex border-[#30363d] overflow-x-auto ">
          {repositories.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleSetActiveRepository(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                activeRepository.name === tab.name 
                  ? 'border-[#f78166] text-[#f0f6fc]' 
                  : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#8b949e]'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;