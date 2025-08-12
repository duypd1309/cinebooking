import DeleteShowtimeModal from "@/app/components/modal/showtimes/DeleteShowtimeModal";

// For soft navigation to the delete page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <DeleteShowtimeModal showtimeId={id} />;
}
