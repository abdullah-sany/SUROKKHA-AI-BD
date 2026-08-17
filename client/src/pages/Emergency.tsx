import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { searchAmbulances, getAmbulanceDistricts } from "../services/ambulanceService";
import { getEmergencyContacts } from "../services/emergencyContactService";
import { addTimelineEntry } from "../services/timelineService";
import type { AmbulanceProvider, EmergencyContact } from "../types";
import { ApiError } from "../services/apiClient";
import { EmergencyActionGrid } from "../components/emergency/EmergencyActionGrid";
import { AmbulanceCard } from "../components/ambulance/AmbulanceCard";
import { EmergencyContactCard } from "../components/emergency/EmergencyContactCard";
import { SkeletonCard, ErrorState, EmptyState } from "../components/ui/Feedback";
import { Button } from "../components/ui/Button";
import { IconMapPin } from "../components/ui/Icons";

type Tab = "ambulance" | "hospital" | "contacts" | "nearby";

export default function Emergency() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) || "ambulance";
  const geolocation = useGeolocation();

  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [ambulances, setAmbulances] = useState<AmbulanceProvider[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    addTimelineEntry("EMERGENCY_SEARCH", "Opened Emergency Hub").catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === "hospital") {
      navigate("/healthcare");
    }
  }, [tab, navigate]);

  useEffect(() => {
    getAmbulanceDistricts().then(setDistricts).catch(() => {});
  }, []);

  async function loadAmbulances(district?: string, useLocation?: boolean) {
    setLoading(true);
    setError(null);
    try {
      const items = await searchAmbulances({
        district: district || undefined,
        latitude: useLocation ? geolocation.coords?.latitude : undefined,
        longitude: useLocation ? geolocation.coords?.longitude : undefined,
      });
      setAmbulances(items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load ambulance services.");
    } finally {
      setLoading(false);
    }
  }

  async function loadContacts() {
    setLoading(true);
    setError(null);
    try {
      setContacts(await getEmergencyContacts());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load emergency contacts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "ambulance") loadAmbulances(selectedDistrict);
    if (tab === "contacts") loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function handleUseLocation() {
    const result = await geolocation.request();
    if (result.status !== "granted") {
      showToast(t("healthcare.locationDenied"), "warning");
      return;
    }
    loadAmbulances(undefined, true);
  }

  async function handleNearby() {
    setParams({ tab: "nearby" });
    const result = await geolocation.request();
    if (result.status !== "granted") {
      showToast(t("healthcare.locationDenied"), "warning");
      setParams({ tab: "ambulance" });
      return;
    }
    setLoading(true);
    try {
      const items = await searchAmbulances({ latitude: result.coords!.latitude, longitude: result.coords!.longitude });
      setAmbulances(items);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pt-1">
      <section>
        <h1 className="font-display text-2xl font-semibold text-navy-800">🚨 {t("emergency.title")}</h1>
        <p className="text-stone-500 mt-1">{t("emergency.subtitle")}</p>
      </section>

      <EmergencyActionGrid
        activeTab={tab}
        onSelect={(key) => {
          if (key === "hospital") navigate("/healthcare");
          else if (key === "nearby") handleNearby();
          else setParams({ tab: key });
        }}
      />

      {tab === "ambulance" && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => { setSelectedDistrict(e.target.value); loadAmbulances(e.target.value); }}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm min-h-[40px]"
            >
              <option value="">{t("healthcare.district")}: {t("healthcare.ownershipAll")}</option>
              {districts.filter((d) => d !== "Nationwide").map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <Button variant="outline" size="sm" icon={<IconMapPin width={16} height={16} />} onClick={handleUseLocation}>
              {t("healthcare.enableLocation")}
            </Button>
          </div>

          {loading && <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>}
          {error && <ErrorState message={error} onRetry={() => loadAmbulances(selectedDistrict)} retryLabel={t("common.retry")} />}
          {!loading && !error && ambulances.length === 0 && (
            <EmptyState title={t("ambulance.noResults")} />
          )}
          {!loading && ambulances.map((a) => <AmbulanceCard key={a.id} ambulance={a} />)}
        </section>
      )}

      {tab === "contacts" && (
        <section className="space-y-3">
          {loading && <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>}
          {error && <ErrorState message={error} onRetry={loadContacts} retryLabel={t("common.retry")} />}
          {!loading && contacts.map((c) => <EmergencyContactCard key={c.id} contact={c} />)}
        </section>
      )}

      {tab === "nearby" && (
        <section className="space-y-3">
          {loading && <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>}
          {!loading && ambulances.length === 0 && <EmptyState title={t("ambulance.noResults")} />}
          {!loading && ambulances.map((a) => <AmbulanceCard key={a.id} ambulance={a} />)}
        </section>
      )}
    </div>
  );
}
