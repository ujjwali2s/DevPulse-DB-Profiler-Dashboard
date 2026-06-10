-- -- sql/get_staff_profile.sql
-- SELECT
--   p.First_Name || ' ' || p.Last_Name AS name,
--   p.Email,
--   p.Phone,
--   a.Street,
--   a.City,
--   a.Country,
--   s.Join_date,
--   s.Designation,
--   b.Branch_id,
--   b.Branch_name
-- FROM Staff s
-- JOIN Person_Info p ON s.Person_id = p.Person_id
-- JOIN Address a ON p.Address_id = a.Address_id
-- JOIN Branch b ON s.Branch_id = b.Branch_id
-- WHERE s.Account_id = $1;

SELECT
  CONCAT(p.First_Name, ' ', p.Last_Name) AS name,
  p.Email AS email,
  p.Phone AS phone,
  a.Street,
  a.City,
  a.Country,
  s.Join_date,
  s.Designation,
  s.Branch_id,
  b.Branch_name
FROM Account acc
JOIN Staff s ON acc.Account_id = s.Account_id
JOIN Person_Info p ON s.Person_id = p.Person_id
JOIN Address a ON p.Address_id = a.Address_id
JOIN Branch b ON s.Branch_id = b.Branch_id
WHERE acc.Username = $1;

