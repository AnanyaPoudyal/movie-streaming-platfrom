'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './page.module.css'; 

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); 

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('https://api.themoviedb.org/3/discover/movie', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
          }
        });
        const data = await res.json();
        console.log("Fetched movies data: ", data); 
        setMovies(data.results || []); 
        setSelectedMovie(data.results[0] || null); 
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div>
      <Head>
        <title>Movie Streaming Platform</title>
      </Head>

      {/* Banner with movie description */}
      {selectedMovie && selectedMovie.backdrop_path && (
        <section className={styles.banner}>
          <img
            src={`https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`}
            alt="Movie Banner"
            className={styles.bannerImage}
          />
          <div className={styles.overlay}></div>
          <div className={styles.bannerContent}>
            <h1 className={styles.title}>{selectedMovie.title}</h1>
            <p className={styles.overview}>{selectedMovie.overview}</p>
            {selectedMovie.vote_average && (
              <div className={styles.ratingBox}>
                <span className={styles.ratingText}>
                  IMDb: {selectedMovie.vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      <div className={styles.movieSlideshow}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={styles.movieThumbnail}
            onClick={() => handleMovieClick(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className={styles.movieImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
