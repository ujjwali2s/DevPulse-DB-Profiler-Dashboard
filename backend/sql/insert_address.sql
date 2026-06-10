INSERT INTO address (street, postal_code, city, division, country)
VALUES ($1, $2, $3, $4, $5)
RETURNING address_id;
