CREATE TABLE member_signup_log (
  log_id SERIAL PRIMARY KEY,
  member_id INT REFERENCES member(member_id),
  signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  username TEXT
);

-- STEP 2: Create the trigger function
CREATE OR REPLACE FUNCTION log_new_member_signup()
RETURNS TRIGGER AS $$
DECLARE
  full_name TEXT;
  email TEXT;
  phone TEXT;
  username TEXT;
BEGIN
  -- Get data from person_info
  SELECT CONCAT_WS(' ', p.first_name, p.last_name), p.email, p.phone
  INTO full_name, email, phone
  FROM person_info p
  WHERE p.person_id = NEW.person_id;

  -- Get data from account
  SELECT a.username
  INTO username
  FROM account a
  WHERE a.account_id = NEW.account_id;

  -- Insert into log table
  INSERT INTO member_signup_log (
    member_id, full_name, email, phone, username
  ) VALUES (
    NEW.member_id, full_name, email, phone, username
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 3: Create the trigger
CREATE TRIGGER trigger_log_member_signup
AFTER INSERT ON member
FOR EACH ROW
EXECUTE FUNCTION log_new_member_signup();
