import { getLocations } from "@/lib/data";
import LocationCatalog from "@/components/LocationCatalog";

export const metadata = { title: "Locations — Dublin Photo Spots" };

export default function LocationsPage() {
  const locations = getLocations();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Photography locations</h1>
      <LocationCatalog locations={locations} />
    </div>
  );
}
