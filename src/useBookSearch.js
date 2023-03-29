import { useEffect, useState } from "react";
import axios from "axios";

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState([]);
  useEffect(() => setBooks([]), [query]);
  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "https://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c))
    })
      .then((res) => {
        setBooks((prevBooks) => {
          return [
            ...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)])
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });

    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
};

export default useBookSearch;
