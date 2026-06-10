SELECT
  b.book_id,
  b.title,
  b.cover_filename AS cover,
  pi.first_name || ' ' || pi.last_name AS author,
  json_agg(
    json_build_object(
      'review_id', r.review_id,
      'rating', r.rating,
      'description', r.description,
      'review_date', r.review_date
    )
    ORDER BY r.review_date DESC
  ) FILTER (WHERE r.review_id IS NOT NULL) AS reviews
FROM book b
JOIN book_genre bg ON b.book_id = bg.book_id
JOIN genre g ON g.genre_id = bg.genre_id
JOIN book_author ba ON ba.book_id = b.book_id
JOIN author a ON a.author_id = ba.author_id
JOIN person_info pi ON pi.person_id = a.person_id
LEFT JOIN review r ON r.book_id = b.book_id
WHERE g.genre_id = $1
GROUP BY b.book_id, b.title, b.cover_filename, pi.first_name, pi.last_name;
