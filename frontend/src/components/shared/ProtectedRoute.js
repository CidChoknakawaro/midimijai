import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn) {
        return _jsx(Navigate, { to: "/auth", replace: true });
    }
    return children;
};
export default ProtectedRoute;
