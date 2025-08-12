import FeaturedMoviesSlider from "../components/FeaturedMoviesSlider";
import Card from "../components/Card";
import FeedbackSection from "../components/Feedback";
import MovieSlider from "../components/MovieSlider";

export default function Home() {
  return (
    <main>
      {/* Slideshow phim nổi bật */}
      <div className="mt-[92px]">
        <FeaturedMoviesSlider />
      </div>

      <Card></Card>

      {/* Phim đang chiếu */}
      <MovieSlider nowShowing={true} />

      {/* Phim sắp chiếu */}
      <MovieSlider nowShowing={false} />

      <FeedbackSection></FeedbackSection>
    </main>
  );
}
