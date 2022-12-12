import AdminHome from "../admin/AdminHome";
import Chapter from "../admin/Chapter";
import ReportManager from "../admin/ReportManager";
import Update from "../admin/Update";
import ActiveAccount from "../auth/ActiveAccount";
import ActiveForgotPassword from "../auth/ActiveForgotPassword";
import ChangePassword from "../auth/ChangePassword";
import ForgotPassword from "../auth/ForgotPassword";
import Login from "../auth/Login";
import Register from "../auth/Register";
import CardDetail from "../cardDetail/CardDetail";
import DefaultLayout from "../components/defaultlayout/DefaultLayout";
import Home from "../home/Home";
import Search from "../searchPage/Search";
import UserProfile from "../userManager/UserProfile";
import UserFollow from "../userRead/UserFollow";
import UserRead from "../userRead/UserRead";
import MovieWatch from "../watching/MovieWatch";
import AdminUserMa from "../admin/AdminUserMa";
import Create from "../admin/Create";
export const privateRouter = [
    {
        element: AdminHome,
        path: "/admin/manager",
        defaultlayout: DefaultLayout,
    },
    {
        element: ReportManager,
        path: "/report/manager",
        defaultlayout: DefaultLayout,
    },
    {
        element: AdminUserMa,
        path: "/admin/user/manager",
        defaultlayout: DefaultLayout,
    },
    {
        element: Create,
        path: "/admin/create",
        defaultlayout: DefaultLayout,
    },
    {
        element: Update,
        path: "/admin/update/:slug",
        defaultlayout: DefaultLayout,
    },
    {
        element: Chapter,
        path: "/admin/chapter/:slug",
        defaultlayout: DefaultLayout,
    },
];
export const publicRouter = [
    { element: Register, path: "/register" },
    { element: Login, path: "/login" },
    {
        element: Search,
        path: "/tim-kiem",
        defaultlayout: DefaultLayout,
    },
    { element: ForgotPassword, path: "/forgot_password" },
    {
        element: ChangePassword,
        path: "/auth/change_password",
    },
    {
        element: UserProfile,
        path: "/user/manager",
        defaultlayout: DefaultLayout,
    },
    {
        element: UserRead,
        path: "/user/truyen-da-doc",
        defaultlayout: DefaultLayout,
    },
    {
        element: UserFollow,
        path: "/user/truyen-theo-doi",
        defaultlayout: DefaultLayout,
    },
    {
        element: ActiveForgotPassword,
        path: "/auth/forgot/:slug",
    },
    {
        element: ActiveAccount,
        path: "/account/active/:slug",
    },
    { element: Home, path: "/", defaultlayout: DefaultLayout },
    { element: CardDetail, path: "/:slug", defaultlayout: DefaultLayout },
    {
        element: MovieWatch,
        path: "/truyen-tranh/:slug/:chapter",
        defaultlayout: DefaultLayout,
    },
];
