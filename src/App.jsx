// import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { HashRouter, BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/home/home';
import NotFound from './components/home/404';
import Workspace from './components/utils/workspace';
import Login from './components/home/loginpage';
import Recognition from './components/home/recognition';

import { RecoilRoot } from 'recoil';
import '@fontsource/ubuntu';

export const App = () => (
    <RecoilRoot>
      {/* <BrowserRouter> */}
      {/* for preventing 404 from refresh */}
      <HashRouter>
        <Routes>
          <Route path="/">
            <Route path="" element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="404" element={<NotFound />} />
            <Route path="workspace" element={<Workspace />} /> {/* Disable After Testing */}
            {/* <Route path="recognition" element={<Recognition />} /> */}
            {/* <Route path="login" element={<Login />} /> */}
          </Route>
          <Route path="*" element={<Navigate to="404" />} />
        </Routes>
      </HashRouter>
      {/* </BrowserRouter> */}
    </RecoilRoot>
);