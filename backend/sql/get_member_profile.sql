-- get_member_profile.sql

-- SELECT
--   pi.first_name || ' ' || pi.last_name AS name,
--   pi.email,
--   pi.phone,
--   a.username,
--   ad.street,
--   ad.city,
--   ad.country
-- FROM account a
-- JOIN person_info pi ON a.person_id = pi.person_id
-- JOIN address ad ON pi.address_id = ad.address_id
-- WHERE a.username = $1;


-- SELECT
--   pi.first_name || ' ' || pi.last_name AS name,
--   pi.email,
--   pi.phone,
--   ad.street,
--   ad.city,
--   ad.country,
--   m.join_date,
--   ms.status_name AS membership_status
-- FROM account a
-- JOIN member m ON a.account_id = m.account_id
-- JOIN person_info pi ON m.person_id = pi.person_id
-- LEFT JOIN address ad ON pi.address_id = ad.address_id
-- JOIN membership_status ms ON m.status_id = ms.status_id
-- WHERE a.username = $1;

-- SELECT
--   a.username,
--   pi.first_name || ' ' || pi.last_name AS name,
--   pi.email,
--   pi.phone,
--   ad.street,
--   ad.city,
--   ad.country,
--   m.join_date,
--   ms.status_name
-- FROM account a
-- JOIN member m ON a.account_id = m.account_id
-- JOIN person_info pi ON m.person_id = pi.person_id
-- LEFT JOIN address ad ON pi.address_id = ad.address_id
-- JOIN membership_status ms ON m.status_id = ms.status_id
-- WHERE a.username = $1;

SELECT
  a.username,
  pi.first_name || ' ' || pi.last_name AS name,
  pi.email,
  pi.phone,
  ad.street,
  ad.city,
  ad.country,
  m.join_date,
  ms.status_name
FROM account a
JOIN member m ON a.account_id = m.account_id
JOIN person_info pi ON m.person_id = pi.person_id
LEFT JOIN address ad ON pi.address_id = ad.address_id
JOIN membership_status ms ON m.status_id = ms.status_id
WHERE a.username = $1;
