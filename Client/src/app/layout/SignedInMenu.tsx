import { Button, Menu, Fade, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { signOut } from "../../features/account/accountSlice";
import { leaveGame } from "../../features/quizBowl/quizSlice";

import { useAppDispatch, useAppSelector } from "../Store/configureStore";

export default function SignedInMenu() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{ color: "inherit", textDecoration: "none", boxShadow: "none" }}
        component={NavLink}
        to="/lobby"
      >
        Lobby
      </Typography>
      <Button color="inherit" onClick={handleClick} sx={{ typography: "h6" }}>
        {user?.email}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem component={Link} to="/game">
          Quiz Bowl
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(leaveGame());
            dispatch(signOut());
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
