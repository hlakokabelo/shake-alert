import { Route, Routes } from "react-router";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
 return(
<div>
        <Toaster />

  <Routes>
            <Route path={'/'} element={<Home />} />
            <Route path="*" element={<NotFound />} />
  </Routes>
</div>)
}

export default App;