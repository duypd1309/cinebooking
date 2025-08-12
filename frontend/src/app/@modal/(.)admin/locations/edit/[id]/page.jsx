import EditLocationModal from "@/app/components/modal/locations/EditLocationModal";

// For soft navigation to the edit page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <EditLocationModal locationId={id} />;
}
