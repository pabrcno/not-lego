import { useState } from "react";
import GlobalStyle from "./styles/global";
import Paused from "./pages/Store/PausedExample";

enum Pages {
  Main,
  Store,
}
function App() {
  return (
    <>
      <GlobalStyle />
      <Paused />
    </>
  );
}

export default App;
