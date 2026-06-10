-- SELECT
--   b.book_id,
--   b.title,
--   pi.first_name || ' ' || pi.last_name AS author,
--   b.cover_filename AS cover,
--   br.borrow_date
-- FROM borrow_record br
-- JOIN book b ON b.book_id = br.book_id
-- JOIN book_author ba ON ba.book_id = b.book_id
-- JOIN author a ON a.author_id = ba.author_id
-- JOIN person_info pi ON pi.person_id = a.person_id
-- WHERE br.member_id = $1
--   AND br.borrow_date >= date_trunc('month', CURRENT_DATE) - interval '1 month'
-- ORDER BY br.borrow_date DESC
-- LIMIT 5;

-- SELECT
--   b.book_id,
--   b.title,
--   pi.first_name || ' ' || pi.last_name AS author,
--   br.borrow_date
-- FROM
--   borrow_record br
-- JOIN
--   book b ON br.book_id = b.book_id
-- JOIN
--   book_author ba ON ba.book_id = b.book_id
-- JOIN
--   author a ON ba.author_id = a.author_id
-- JOIN
--   person_info pi ON a.person_id = pi.person_id
-- WHERE
--   br.member_id = $1
--   AND br.borrow_date >= (CURRENT_DATE - INTERVAL '1 month')
-- ORDER BY
--   br.borrow_date DESC
-- LIMIT 5;

-- SELECT
--   b.book_id,
--   b.title,
--   pi.first_name || ' ' || pi.last_name AS author,
--   br.borrow_date
-- FROM
--   borrow_record br
-- JOIN
--   book_copy c ON br.copy_id = c.copy_id
-- JOIN
--   book b ON c.book_id = b.book_id
-- JOIN
--   book_author ba ON b.book_id = ba.book_id
-- JOIN
--   author a ON ba.author_id = a.author_id
-- JOIN
--   person_info pi ON a.person_id = pi.person_id
-- WHERE
--   br.member_id = $1
--   AND br.borrow_date >= (CURRENT_DATE - INTERVAL '1 month')
-- ORDER BY
--   br.borrow_date DESC
-- LIMIT 5;

SELECT
  b.book_id,
  b.title,
  b.cover_filename AS cover,
  pi.first_name || ' ' || pi.last_name AS author
FROM
  borrow_record br
JOIN book_copy c ON br.copy_id = c.copy_id
JOIN book b ON c.book_id = b.book_id
JOIN book_author ba ON b.book_id = ba.book_id
JOIN author a ON ba.author_id = a.author_id
JOIN person_info pi ON a.person_id = pi.person_id
WHERE
  br.member_id = $1
  AND br.borrow_date >= (CURRENT_DATE - INTERVAL '1 month')
ORDER BY
  br.borrow_date DESC
LIMIT 5;


