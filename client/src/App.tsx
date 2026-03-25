import './index.css';
import { Topbar } from './components/layout/Topbar';
import { NavBar } from './components/layout/NavBar';
import { CallListPage } from './components/call-list/CallListPage';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <Topbar />
      <NavBar />
      <CallListPage />
    </div>
  );
}

export default App;
