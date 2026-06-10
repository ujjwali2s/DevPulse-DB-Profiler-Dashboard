SELECT COUNT(*)
FROM book_copy
WHERE book_id = ANY($1) -- $1 is an array of book_ids
AND branch_id = $2
AND availability_status = 'yes';
