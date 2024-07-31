import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import NavbarMain from "../components/navbar/navbar";
import { UserProvider } from "../contexts/UserContext";

const theme = createTheme({
  palette: {
      // action: {
      //   selected: '#E7A615',
      //   hover: '#525252',
      //   disabled: '#9B9B9B'
      // },
      primary: {
          main: '#262626',
      },
      secondary: {
          main: '#262626',
      },
      background: {
        default: '#52525200',
        paper: '#52525200',
      },
      text: {
        primary: '#ffffff',
      },
  },
});

export default function Root() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
          <NavbarMain />
          <div className="p-4">
            <Outlet />
          </div>
      </UserProvider>
    </ThemeProvider>
  );
}