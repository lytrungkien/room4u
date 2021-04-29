//import css
import './App.css';
import { Input } from 'antd';
import 'antd/dist/antd.css';

//import react router
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

//import components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Home from './components/Homepage/Home';
import Register from './components/Register/Register';
import PhongTroSV from './components/PhongTroSV';
import ChungCuMini from './components/ChungCuMini';
import PageDetail from './components/PageDetail/PageDetail';

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <div className="search">
          <Input.Search
            placeholder="Tìm kiếm phòng bạn muốn..."
            allowClear
            // onSearch={onSearch}
            className="inputSearch"
            size="large"
          />
        </div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/phong-tro-sv" exact>
            <PhongTroSV />
          </Route>
          <Route path="/phong-tro-sv/:id">
            <PageDetail />
          </Route>
          <Route path="/chung-cu-mini" exact>
            <ChungCuMini />
          </Route>
          <Route path="/chung-cu-mini/:id">
            <PageDetail />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;