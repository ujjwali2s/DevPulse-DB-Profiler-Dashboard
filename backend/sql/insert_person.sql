INSERT INTO person_info (first_name, last_name, email, phone, address_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING person_id;
