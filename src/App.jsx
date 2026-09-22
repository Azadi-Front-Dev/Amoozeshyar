import "./App.css";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Notfound from "./Pages/Notfound";
import { useRoutes } from "react-router-dom";
import ForgotPassword from "./Pages/ForgotPassword";

const routes = [
  { path: "/", element: <Home /> },
  { path: "*", element: <Notfound /> },
  { path: "/Login", element: <Login /> },
  { path: "/ForgotPassword", element: <ForgotPassword /> },
];

function App() {
  const router = useRoutes(routes);
  return (
    <>
      <div className=""></div>
      {router}
    </>
  );
}

export default App;
