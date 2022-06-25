import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './route/Home';
import Detail from "./route/Detail";
import Chart from "./route/Chart";
import Price from "./route/Price";

function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:coinId" element={<Detail/>}>
          <Route path="chart" element={<Chart/>}/>
          <Route path="price" element={<Price/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
