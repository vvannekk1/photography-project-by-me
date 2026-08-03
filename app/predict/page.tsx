import { getLocations, getSessions } from "@/lib/data";
import { buildLookup } from "@/lib/matchLocation";
import PredictorForm from "@/components/PredictorForm";

export const metadata = { title: "Predictor — Dublin Photo Spots" };

export default function PredictPage() {
  const locations = getLocations();
  const sessions = getSessions();
  const lookup = buildLookup(locations, sessions);
  return <PredictorForm lookup={lookup} />;
}
