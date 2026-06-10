-- SELECT
--   b.book_id,
--   b.title,
--   b.isbn,
--   b.publish_year,
--   b.language,
--   b.edition,
--   b.price,
--   p.publisher_name,
--   authors.authors AS author_names,
--   genres.genres AS genre_names
-- FROM book b
-- LEFT JOIN publisher p ON b.publisher_id = p.publisher_id

-- LEFT JOIN (
--   SELECT ba.book_id, STRING_AGG(pi.first_name || ' ' || pi.last_name, ', ') AS authors
--   FROM book_author ba
--   JOIN author a ON ba.author_id = a.author_id
--   JOIN person_info pi ON a.person_id = pi.person_id
--   GROUP BY ba.book_id
-- ) authors ON authors.book_id = b.book_id

-- LEFT JOIN (
--   SELECT bg.book_id, STRING_AGG(g.name, ', ') AS genres
--   FROM book_genre bg
--   JOIN genre g ON bg.genre_id = g.genre_id
--   GROUP BY bg.book_id
-- ) genres ON genres.book_id = b.book_id

-- WHERE
--   ($1::text IS NULL OR b.title ILIKE '%' || $1 || '%')
--   AND ($2::text IS NULL OR b.language ILIKE '%' || $2 || '%')
--   AND (
--     $3::text IS NULL OR EXISTS (
--       SELECT 1 FROM book_author ba2
--       JOIN author a2 ON ba2.author_id = a2.author_id
--       JOIN person_info pi2 ON a2.person_id = pi2.person_id
--       WHERE ba2.book_id = b.book_id
--         AND (pi2.first_name || ' ' || pi2.last_name) ILIKE '%' || $3 || '%'
--     )
--   )
--   AND (
--     $4::text IS NULL OR EXISTS (
--       SELECT 1 FROM book_genre bg2
--       JOIN genre g2 ON bg2.genre_id = g2.genre_id
--       WHERE bg2.book_id = b.book_id
--         AND g2.name ILIKE '%' || $4 || '%'
--     )
--   );


SELECT
  b.book_id,
  b.title,
  b.isbn,
  b.publish_year,
  b.language,
  b.edition,
  b.price,

  p.publisher_id,
  p.publisher_name,

  authors.author_names,
  authors.author_ids,

  genres.genre_names,
  genres.genre_ids

FROM book b
LEFT JOIN publisher p ON b.publisher_id = p.publisher_id

-- Author subquery: get name string and array of IDs
LEFT JOIN (
  SELECT 
    ba.book_id,
    STRING_AGG(pi.first_name || ' ' || pi.last_name, ', ') AS author_names,
    ARRAY_AGG(a.author_id) AS author_ids
  FROM book_author ba
  JOIN author a ON ba.author_id = a.author_id
  JOIN person_info pi ON a.person_id = pi.person_id
  GROUP BY ba.book_id
) authors ON authors.book_id = b.book_id

-- Genre subquery: get name string and array of IDs
LEFT JOIN (
  SELECT 
    bg.book_id,
    STRING_AGG(g.name, ', ') AS genre_names,
    ARRAY_AGG(g.genre_id) AS genre_ids
  FROM book_genre bg
  JOIN genre g ON bg.genre_id = g.genre_id
  GROUP BY bg.book_id
) genres ON genres.book_id = b.book_id

WHERE
  ($1::text IS NULL OR b.title ILIKE '%' || $1 || '%')
  AND ($2::text IS NULL OR b.language ILIKE '%' || $2 || '%')
  AND (
    $3::text IS NULL OR EXISTS (
      SELECT 1 FROM book_author ba2
      JOIN author a2 ON ba2.author_id = a2.author_id
      JOIN person_info pi2 ON a2.person_id = pi2.person_id
      WHERE ba2.book_id = b.book_id
        AND (pi2.first_name || ' ' || pi2.last_name) ILIKE '%' || $3 || '%'
    )
  )
  AND (
    $4::text IS NULL OR EXISTS (
      SELECT 1 FROM book_genre bg2
      JOIN genre g2 ON bg2.genre_id = g2.genre_id
      WHERE bg2.book_id = b.book_id
        AND g2.name ILIKE '%' || $4 || '%'
    )
  );
