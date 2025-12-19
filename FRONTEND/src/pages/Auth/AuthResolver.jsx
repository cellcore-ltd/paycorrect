import { useParams } from "react-router-dom";

import AdminLanding from "./admin/Auth";
import AdminRegister from "./admin/Register";
import AdminLogin from "./admin/Login";
import AdminSplash from "./admin/Splash";
import AdminForgotPassword from "./admin/ForgetPassword";

const authMap = {
  admin: {
    landing: AdminLanding,
    register: AdminRegister,
    login: AdminLogin,
    splash: AdminSplash,
    forgotPassword: AdminForgotPassword,
  },
};

export default function AuthResolver({ page }) {
  const { userType } = useParams();
  const Component = authMap?.[userType]?.[page];

  if (!Component) return <h1>404 - Auth Page Not Found</h1>;

  return <Component />;
}
