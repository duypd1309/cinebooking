import DeleteTheaterModal from "@/app/components/modal/theaters/DeleteTheaterModal";

// For soft navigation to the delete page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <DeleteTheaterModal theaterId={id} />;
}
