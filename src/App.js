import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";
import useBookSearch from "./useBookSearch";

export default function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      // here we are disconnecting the observer from the previous last element
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        // when the last element  is visible on the screen we are incrementing the page number
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((curNumber) => curNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => console.log(loading, error, books, hasMore), [
    loading,
    error,
    books,
    hasMore
  ]);

  return (
    <div className="App">
      <input type="text" onChange={handleSearch} />

      {books.map((book, i) => {
        if (books.length - 1 === i) {
          return (
            // adding the ref to the last element
            <h6 ref={lastElementRef} key={book}>
              {book}
            </h6>
          );
        } else {
          return <h6 key={book}>{book}</h6>;
        }
      })}

      <div>{loading && "loading..."}</div>
      <div>{error && "error"}</div>
    </div>
  );
}
