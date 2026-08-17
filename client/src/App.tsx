import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AppShell } from "./layouts/AppShell";
import Home from "./pages/Home";
import FirstAid from "./pages/FirstAid";
import Emergency from "./pages/Emergency";
import Healthcare from "./pages/Healthcare";
import Prescription from "./pages/Prescription";
import Specialist from "./pages/Specialist";
import Timeline from "./pages/Timeline";
import DataSources from "./pages/DataSources";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Home />} />
              <Route path="first-aid" element={<FirstAid />} />
              <Route path="emergency" element={<Emergency />} />
              <Route path="healthcare" element={<Healthcare />} />
              <Route path="prescription" element={<Prescription />} />
              <Route path="specialist" element={<Specialist />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="data-sources" element={<DataSources />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </LanguageProvider>
  );
}
