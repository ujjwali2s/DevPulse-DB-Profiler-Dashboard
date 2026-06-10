-- INSERT INTO member (person_id, join_date, status, account_id)
-- VALUES ($1, CURRENT_DATE, 'Active', $2);

-- INSERT INTO member (person_id, join_date, status_id, account_id)
-- VALUES (
--   $1,
--   CURRENT_DATE,
--   (SELECT status_id FROM membership_status WHERE status_name = 'Active'),
--   $2
-- );


-- insert_member.sql
INSERT INTO member (person_id, account_id, join_date, status_id)
VALUES ($1, $2, CURRENT_DATE, $3);
