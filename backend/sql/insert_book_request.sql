INSERT INTO Book_request (member_id, book_id, request_date, request_status)
VALUES ($1, $2, CURRENT_DATE, 'pending');
