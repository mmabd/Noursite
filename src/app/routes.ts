import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout";
import { HomePage } from "./components/HomePage";
import { ProjectPage } from "./components/ProjectPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "project/:num", Component: ProjectPage },
    ],
  },
]);
