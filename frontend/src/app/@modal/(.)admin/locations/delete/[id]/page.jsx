import DeleteLocationModal from "@/app/components/modal/locations/DeleteLocationModal";

// For soft navigation to the delete page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <DeleteLocationModal locationId={id} />;
}
