import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateLayout } from "@/components/layout/PrivateLayout";
import { routeConfig } from "@/routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateLayout />}>
          {routeConfig.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
