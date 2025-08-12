import DeleteMovieModal from "@/app/components/modal/movies/DeleteMovieModal";

// For soft navigation to the delete page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <DeleteMovieModal movieId={id} />;
}
