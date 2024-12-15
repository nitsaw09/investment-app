import { Navigate, redirect, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { SignupPage } from './pages/Signup/Signup';
import { DashboardPage } from './pages/Dashboard/Dashboard';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { PortfolioPage } from './pages/Portfolio/Portfolio';

const authLoader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return null;
};

const theme = createTheme({
  palette: {
    mode: 'dark',
     primary: {
      main: '#ff5252',
    },
    secondary: {
      main: '#666',
    },
    background: {
      default: '#4b4b4b',
      paper: '#222',
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/Signup",
    element: <SignupPage />
  },
  {
    path: "/Dashboard",
    element: <DashboardPage />,
    loader: authLoader
  },
  {
    path: "/Portfolio",
    element: <PortfolioPage />,
    loader: authLoader
  }
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;