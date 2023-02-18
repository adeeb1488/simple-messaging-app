import './App.scss';
import {Route} from 'react-router-dom';
import home from './pages/home';
import chats from './pages/chats';
function App() {
  return (
    <div className="App">
   <Route path = '/' component={home} exact />
   <Route path = '/chats' component={chats}  />
    
    </div>
  );
}

export default App;
