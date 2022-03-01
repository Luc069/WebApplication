import {
  Navigate,
  Outlet
} from "react-router-dom"

export const AuthLayout = ({ isAuthenticated }) => {
  if (isAuthenticated === undefined) return null

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />
}

export const AnonymousLayout = ({ isAuthenticated, to }) => {
  if (isAuthenticated === undefined) return null

  return isAuthenticated
    ? <Navigate to={to} replace />
    : <Outlet />
}