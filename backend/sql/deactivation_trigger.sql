-- Table to log deactivated members
CREATE TABLE IF NOT EXISTS Deactivated_Members (
  Deactivation_id SERIAL PRIMARY KEY,
  Member_id INT NOT NULL,
  Username VARCHAR(100) NOT NULL,
  Deactivation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- Trigger function to log when an account is deleted
-- CREATE OR REPLACE FUNCTION log_member_deactivation() RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO Deactivated_Members (Member_id, Username, Deactivation_date)
--   VALUES (
--     (SELECT Member_id FROM Member WHERE Account_id = OLD.Account_id),
--     OLD.Username,
--     CURRENT_TIMESTAMP
--   );
--   RETURN OLD;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Create trigger on Account table after delete
-- DROP TRIGGER IF EXISTS trg_log_deactivation ON Account;

-- CREATE TRIGGER trg_log_deactivation
-- AFTER DELETE ON Account
-- FOR EACH ROW
-- EXECUTE FUNCTION log_member_deactivation();



-- Drop previous trigger if exists
DROP TRIGGER IF EXISTS trg_log_deactivation ON Account;

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION log_member_deactivation() RETURNS TRIGGER AS $$
DECLARE
  memberId INT;
BEGIN
  SELECT Member_id INTO memberId FROM Member WHERE Account_id = OLD.Account_id LIMIT 1;

  INSERT INTO Deactivated_Members (Member_id, Username, Deactivation_date)
  VALUES (memberId, OLD.Username, CURRENT_TIMESTAMP);

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trg_log_deactivation
BEFORE DELETE ON Account
FOR EACH ROW
EXECUTE FUNCTION log_member_deactivation();

