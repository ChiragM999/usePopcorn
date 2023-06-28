import { useState, useEffect } from 'react';

const KEY = 'fc761e';

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(
		function () {
			// callback?.();

			const controller = new AbortController();

			if (query.length < 4) {
				setMovies([]);
				setError('');
				return;
			}
			const waitFetch = setTimeout(async function fetchMovies() {
				try {
					setIsLoading(true);
					setError('');
					const res = await fetch(
						`https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
						{ signal: controller.signal }
					);

					if (!res.ok)
						throw new Error('Something went wrong with fetching movies');

					const data = await res.json();
					if (data.Response === 'False') throw new Error('Movie not found');

					setMovies(data.Search);
					setIsLoading(false);
					setError('');
				} catch (err) {
					if (err.name !== 'AbortError') setError(err.message);
				} finally {
					setIsLoading(false);
				}
			}, 500);

			return function () {
				controller.abort();
				clearTimeout(waitFetch);
			};
		},
		[query]
	);

	return { movies, isLoading, error };
}
