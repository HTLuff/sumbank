import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Balance from "./pages/Balance";
import Transfer from "./pages/Transfer";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Navigate to="/signin" replace />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="balance" element={<Balance />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<Admin />} />
        {/* optional 404 */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
