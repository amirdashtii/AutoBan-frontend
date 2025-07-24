import { useState } from "react";
import reactLogo from "./assets/react.svg";
import appLogo from "/favicon.svg";
import PWABadge from "./PWABadge.tsx";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function App() {
  const [count, setCount] = useState(0);
  const theme = createTheme({
    direction: "rtl",
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#ff4081",
      },
    },
    typography: {
      fontFamily: ["Vazirmatn", "Tahoma", "Arial", "sans-serif"].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={appLogo} className="logo" alt="AutoBan logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>AutoBan</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <PWABadge />
    </ThemeProvider>
  );
}

export default App;
