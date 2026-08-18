import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_PUBLIC_API_URL}${url}`;
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error();
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [url]);

  return { data, loading, error };
}
