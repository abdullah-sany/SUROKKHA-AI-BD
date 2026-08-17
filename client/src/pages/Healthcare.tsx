import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";
import { useDebounce } from "../hooks/useDebounce";
import { useGeolocation } from "../hooks/useGeolocation";
import { searchFacilities, getFacilityFilters } from "../services/facilityService";
import { addTimelineEntry } from "../services/timelineService";
import { ApiError } from "../services/apiClient";
import type { Facility } from "../types";
import { FacilityFilters } from "../components/healthcare/FacilityFilters";
import { FacilityCard } from "../components/healthcare/FacilityCard";
import { SkeletonCard, ErrorState, EmptyState } from "../components/ui/Feedback";

export default function Healthcare() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const geolocation = useGeolocation();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [ownership, setOwnership] = useState<"all" | "public" | "private">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"nearest" | "verified" | "name">("name");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const [divisions, setDivisions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [items, setItems] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFacilityFilters().then((f) => { setDivisions(f.divisions); setDistricts(f.districts); }).catch(() => {});
    addTimelineEntry("HOSPITAL_SEARCH", "Opened Healthcare Directory").catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchFacilities({
      search: debouncedSearch || undefined,
      division: division || undefined,
      district: district || undefined,
      facilityType: (facilityType || undefined) as Facility["facilityType"] | undefined,
      ownership,
      verifiedOnly: verifiedOnly || undefined,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      sortBy,
    })
      .then((res) => { if (!cancelled) setItems(res.items); })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load facilities.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedSearch, division, district, facilityType, ownership, verifiedOnly, sortBy, coords]);

  async function handleUseLocation() {
    const result = await geolocation.request();
    if (result.status !== "granted") {
      showToast(t("healthcare.locationDenied"), "warning");
      return;
    }
    setCoords(result.coords);
    setSortBy("nearest");
  }

  return (
    <div className="space-y-6 pt-1">
      <section>
        <h1 className="font-display text-2xl font-semibold text-navy-800">{t("healthcare.title")}</h1>
        <p className="text-stone-500 mt-1">{t("healthcare.subtitle")}</p>
      </section>

      <FacilityFilters
        search={search} onSearchChange={setSearch}
        division={division} onDivisionChange={(v) => { setDivision(v); setDistrict(""); }}
        district={district} onDistrictChange={setDistrict}
        divisions={divisions} districts={districts}
        facilityType={facilityType} onFacilityTypeChange={setFacilityType}
        ownership={ownership} onOwnershipChange={setOwnership}
        verifiedOnly={verifiedOnly} onVerifiedOnlyChange={setVerifiedOnly}
        sortBy={sortBy} onSortByChange={setSortBy}
        onUseLocation={handleUseLocation}
      />

      <section className="space-y-3">
        {loading && <div className="space-y-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}
        {error && <ErrorState message={error} onRetry={() => setDivision((d) => d)} retryLabel={t("common.retry")} />}
        {!loading && !error && items.length === 0 && <EmptyState title={t("healthcare.noResults")} />}
        {!loading && items.map((f) => <FacilityCard key={f.id} facility={f} />)}
      </section>
    </div>
  );
}
