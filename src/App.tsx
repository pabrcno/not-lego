import { useState } from "react";
import GlobalStyle from "./styles/global";
import MainScreen from "./pages";

enum Pages {
  Main,
  Store,
}
function App() {
  return (
    <>
      <GlobalStyle />
      <MainScreen />
    </>
  );
}

export default App;
