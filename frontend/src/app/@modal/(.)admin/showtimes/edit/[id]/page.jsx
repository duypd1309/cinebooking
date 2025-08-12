import EditShowtimeModal from "@/app/components/modal/showtimes/EditShowtimeModal";

// For soft navigation to the edit page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <EditShowtimeModal showtimeId={id} />;
}
