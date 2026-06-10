SELECT book_id, title
FROM book
WHERE title ILIKE '%' || $1 || '%';
