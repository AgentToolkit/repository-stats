import Navbar from './components/Navbar';
import Footer from './sections/Footer';
import RepositoryStatsPage from './pages/RepositoryStatsPage';
import { useState } from 'react';
import Repository from './types/repository';

const REPOSITORIES: Repository[] = [
  {
    "name": "agent-lifecycle-toolkit",
    "shortname": "ALTK",
    "organization": "AgentToolkit",
    "github_repository_url": "",
    "version": "0.9.0"
  }, 
].sort();

const App = () => {
  const [activeRepository, setActiveRepository] = useState(REPOSITORIES[0]);

  function handleSetActiveRepository(repository: Repository) {
    setActiveRepository(repository);
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#58a6ff] selection:text-white pb-20">
      <Navbar repositories={REPOSITORIES} activeRepository={activeRepository} handleSetActiveRepository={handleSetActiveRepository} />
      <RepositoryStatsPage repository={activeRepository} />
      <Footer />
    </div>
  );
};

export default App;
