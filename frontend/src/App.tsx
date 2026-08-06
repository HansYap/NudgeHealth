import { LoginPage } from "./pages/LoginPage";

export default function App() {
  return (
    <LoginPage
      onLoginSuccess={(result) => {
        // TODO: wire up routing (e.g. navigate to dashboard)
        console.log("Login success", result);
      }}
      onNavigateToSignup={() => {
        // TODO: wire up routing to /signup
      }}
      onNavigateToForgotPassword={() => {
        // TODO: wire up routing to /forgot-password
      }}
    />
  );
}
