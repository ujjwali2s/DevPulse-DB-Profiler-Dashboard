SELECT 
  b.title,
  br.borrow_date,
  br.due_return_date,
  br.return_date
FROM Borrow_Record br
JOIN Member m ON br.member_id = m.member_id
JOIN Account a ON m.account_id = a.account_id
JOIN Book_Copy bc ON br.copy_id = bc.copy_id
JOIN Book b ON bc.book_id = b.book_id
WHERE a.username = $1
ORDER BY br.borrow_date DESC;
