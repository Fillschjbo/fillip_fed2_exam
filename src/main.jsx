import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import {Header,Footer} from "./components/Layout/index.jsx";
import {Featured,
        Venues,
        Login,
        Register,
        SearchResults,
        EditProfile,
        Profile,
        CreateVenue,
        EditVenue,
        Venue,
} from "./routes/index.jsx";
import "react-datepicker/dist/react-datepicker.css";

const Layout = () => (
    <div className={"bg-[#F5F5F7]"}>
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer/>
    </div>
)

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Featured/>,
            },
            {
                path: "/venues",
                element: <Venues />
            },
            {
                path: "/venue/:id",
                element: <Venue />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/profile/:name",
                element: <Profile />
            },
            {
                path: "/results",
                element: <SearchResults />
            },
            {
                path: "/venue/create",
                element: <CreateVenue />
            },
            {
                path: "/venue/edit/:id",
                element: <EditVenue />
            },
            {
                path: "/profile/edit/:name",
                element: <EditProfile />
            },
        ]
    },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
