SELECT
  b.book_id,
  b.title,
  b.cover_filename AS cover,
  pi.first_name || ' ' || pi.last_name AS author,
  COUNT(*) AS borrow_count
FROM
  borrow_record br
JOIN book_copy c ON br.copy_id = c.copy_id
JOIN book b ON c.book_id = b.book_id
JOIN book_author ba ON b.book_id = ba.book_id
JOIN author a ON ba.author_id = a.author_id
JOIN person_info pi ON a.person_id = pi.person_id
WHERE
  br.borrow_date >= (CURRENT_DATE - INTERVAL '1 month')
GROUP BY
  b.book_id, b.title, cover, author
ORDER BY
  borrow_count DESC
LIMIT 5;

