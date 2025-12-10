import React, { useState } from "react";

import {
  ActionButton,
  Flex,
  Button,
  Dialog,
  Heading,
  Content,
  TooltipTrigger,
  Tooltip,
  Provider,
  defaultTheme,
} from "@adobe/react-spectrum";

import Home from "@spectrum-icons/workflow/Home";
import LogOut from "@spectrum-icons/workflow/LogOut";
import axios from "axios";
import "../styles/header.css";

const Header = ({
  title,
  onClick,
  showHome = true,
  secondaryTitle,
  showLogout = true,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = async () => {
    console.log("log out triggered");
    // const res = await axios.get("/getConfig");
    // window.location.href = res.data.MLR_LINK;
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleHomeClick = async () => {
    console.log("home triggered");
    // const res = await axios.get("/getConfig");
    // window.location.href = res.data.MLR_HOME;
  };

  return (
    <header className="header-component">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        height="size-800"
      >
        <Flex alignItems="center" gap="size-200">
          <ActionButton
            onPress={handleHomeClick}
            UNSAFE_style={{
              paddingTop: "4px",
              height: "30px",
              width: "50px",
              border: "none",
              fill: "white",
            }}
          >
            {showHome && <Home UNSAFE_className="bell_icon" />}
          </ActionButton>
        </Flex>
        <span
          style={{
            alignContent: "center",
            cursor: onClick ? "pointer" : null,
            textAlign: "left",
            fontSize: "25px",
          }}
        >
          {/* {title} */}
          <span style={{ fontWeight: "bold" }}>Quip </span>{" "}
          <span style={{ fontSize: "20px" }}>
            - Author
          </span>
        </span>

        <Flex alignItems="center" gap="size-300">
          {/* <span
            style={{
              alignContent: "center",
              cursor: onClick ? "pointer" : null,
              textAlign: "left",
              marginRight: "20px",
            }}
            onClick={onClick}>
            {secondaryTitle}
          </span> */}

          <Provider theme={defaultTheme} colorScheme="dark">
            <TooltipTrigger offset={15}>
              <ActionButton
                onPress={handleLogout}
                UNSAFE_style={{
                  paddingTop: "4px",
                  height: "30px",
                  width: "50px",
                  fill: "white",
                  border: "none",
                  background: "none",
                  backgroundColor: "#071d49",
                  boxShadow: "none",
                }}
              >
                {showLogout && <LogOut />}
              </ActionButton>
              <Tooltip>Logout</Tooltip>
            </TooltipTrigger>
          </Provider>
        </Flex>
      </Flex>

      {isDialogOpen && (
        <Dialog
          onDismiss={handleDialogClose}
          UNSAFE_style={{
            position: "fixed",

            right: "15px",

            top: "73px",

            width: "250px",

            height: "350px",

            backgroundColor: "#132f64dd",
          }}
        >
          <Heading>Notifications</Heading>
          <Content>
            <p>Your notifications will appear here.</p>
            <Button variant="secondary" onPress={handleDialogClose}>
              Close
            </Button>
          </Content>
        </Dialog>
      )}
    </header>
  );
};

export default Header;
