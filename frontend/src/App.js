//import logo from './logo.svg';
import './App.css';
import appStore from './Utils/appStore';
import Body from './components/Body';
import { Provider } from 'react-redux';

function App() {
  return (
    
    <Provider store={appStore}>
      <Body/>  
    </Provider>  
    
  );
}

export default App;
