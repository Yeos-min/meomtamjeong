import { createHashRouter } from "react-router";
import Root from "./Root";
import HomePage from "./pages/HomePage";
import PreferenceSelectionPage from "./pages/PreferenceSelectionPage";
import ResultsPage from "./pages/ResultsPage";
import ShopDetailPage from "./pages/ShopDetailPage";
import ShopsPage from "./pages/ShopsPage";
import MapPage from "./pages/MapPage";
import NotebookPage from "./pages/NotebookPage";
import NotebookEntryPage from "./pages/NotebookEntryPage";
import EventsPage from "./pages/EventsPage";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import KakaoAuthPage from "./pages/KakaoAuthPage";
import DirectionsPage from "./pages/DirectionsPage";

export const router = createHashRouter([
  { path: "/splash", Component: SplashPage },
  { path: "/login", Component: LoginPage },
  { path: "/auth/kakao", Component: KakaoAuthPage },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "preference", Component: PreferenceSelectionPage },
      { path: "results", Component: ResultsPage },
      { path: "shops", Component: ShopsPage },
      { path: "shop/:id", Component: ShopDetailPage },
      { path: "shop/:id/directions", Component: DirectionsPage },
      { path: "map", Component: MapPage },
      { path: "notebook", Component: NotebookPage },
      { path: "notebook/entry", Component: NotebookEntryPage },
      { path: "events", Component: EventsPage },
    ],
  },
]);
