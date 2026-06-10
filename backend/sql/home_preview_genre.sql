WITH genre_books AS (
  SELECT
    g.genre_id,
    g.name AS genre_name,
    b.book_id,
    b.title,
    pi.first_name || ' ' || pi.last_name AS author_name,
    b.cover_filename as cover,
    ROW_NUMBER() OVER (PARTITION BY g.genre_id ORDER BY b.book_id) as rn
  FROM genre g
  JOIN book_genre bg ON g.genre_id = bg.genre_id
  JOIN book b ON b.book_id = bg.book_id
  JOIN book_author ba ON ba.book_id = b.book_id
  JOIN author a ON a.author_id = ba.author_id
  JOIN person_info pi ON pi.person_id = a.person_id
)
SELECT genre_id, genre_name,
  json_agg(json_build_object(
    'book_id', book_id,
    'title', title,
    'author', author_name,
    'cover', cover
  )) FILTER (WHERE rn <= 6) AS books
FROM genre_books
GROUP BY genre_id, genre_name;