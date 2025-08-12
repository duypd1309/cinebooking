import EditMovieModal from "@/app/components/modal/movies/EditMovieModal";

// For soft navigation to the edit page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <EditMovieModal movieId={id} />;
}
