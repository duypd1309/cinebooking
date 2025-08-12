import EditTheaterModal from "@/app/components/modal/theaters/EditTheaterModal";

// For soft navigation to the edit page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <EditTheaterModal theaterId={id} />;
}
