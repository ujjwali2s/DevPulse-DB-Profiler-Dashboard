-- INSERT INTO account (username, password, user_type, person_id)
-- VALUES ($1, $2, 'Member', $3)
-- RETURNING account_id;

INSERT INTO account (username, password, user_type)
VALUES ($1, $2, 'Member')
RETURNING account_id;
