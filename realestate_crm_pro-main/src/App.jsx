import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./auth";
import { NotificationProvider, NotificationContainer } from "./notifications";
import "./i18n"; // Initialize i18n

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes />
        <NotificationContainer />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
