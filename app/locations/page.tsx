import { getLocations } from "@/lib/data";
import LocationCatalog from "@/components/LocationCatalog";
import LocationMap from "@/components/LocationMap";

export const metadata = { title: "Locations — Dublin Photo Spots" };

export default function LocationsPage() {
  const locations = getLocations();
  return (
    <div>
      <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--safelight)]">
        The full contact sheet
      </p>
      <h1 className="mt-3 mb-8 font-display text-4xl text-[var(--paper)]">
        Photography locations
      </h1>
      <LocationMap locations={locations} />
      <LocationCatalog locations={locations} />
    </div>
  );
}
