import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { Box, List, ListItem } from "@mui/material";
import { useAppSelector } from "../Store/configureStore";
import SignedInMenu from "./SignedInMenu";

export default function Header() {
  const { user } = useAppSelector((state) => state.account);
  const pageLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];
  const brandStyle = {
    color: "inherit",
    textDecoration: "none",
    typography: "h6",
    "&:hover": {
      color: "grey.500",
    },
    "&.active": {
      color: "text.secondary",
    },
  };
  const AuthLinks = [
    { title: "Login", path: "/login" },
    { title: "Register", path: "/register" },
  ];
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex" }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h2" component={NavLink} to="/" sx={brandStyle}>
            Ordinary Geeks Quiz Bowl
          </Typography>
        </Box>
        <List sx={{ display: "flex" }}>
          {pageLinks.map(({ title, path }) => (
            <ListItem
              key={title}
              component={NavLink}
              to={path}
              sx={{ color: "inherit" }}
            >
              {title}
            </ListItem>
          ))}
        </List>
        {user ? (
          <SignedInMenu />
        ) : (
          <List sx={{ display: "flex" }}>
            {AuthLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        )}
      </Toolbar>
    </AppBar>
  );
}
