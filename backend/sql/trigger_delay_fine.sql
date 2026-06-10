CREATE OR REPLACE FUNCTION calculate_return_delay_fine(bid INT)
RETURNS VOID AS $$
DECLARE
  due_date DATE;
  return_date DATE;
  days_late INT;
  delay_fine_rate DECIMAL(10,2);
  delay_fine_id INT;
BEGIN
  -- Fetch due and return dates
  SELECT br.Due_return_date, br.Return_date
  INTO due_date, return_date
  FROM Borrow_record br
  WHERE br.Borrow_id = bid;

  -- Debugging output
  RAISE NOTICE 'Borrow ID: %, Due: %, Returned: %', bid, due_date, return_date;

  -- Null safety
  IF due_date IS NULL OR return_date IS NULL THEN
    RAISE NOTICE 'One or both dates are NULL for Borrow ID: % → skipping fine calculation', bid;
    RETURN;
  END IF;

  IF return_date > due_date THEN
    days_late := return_date - due_date;

    -- Get fine ID and rate
    SELECT f.Fine_id, f.Daily_rate
    INTO delay_fine_id, delay_fine_rate
    FROM Fine f
    WHERE f.Fine_type = 'Return_delay';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'No fine type "Return_delay" found in Fine table.';
    END IF;

    -- Check if fine already exists (disambiguated column names)
    IF NOT EXISTS (
      SELECT 1 FROM Fine_Calculated fc
      WHERE fc.Borrow_id = bid AND fc.Fine_id = delay_fine_id
    ) THEN
      INSERT INTO Fine_Calculated (Fine_id, Borrow_id, Total_amount)
      VALUES (delay_fine_id, bid, delay_fine_rate * days_late);

      RAISE NOTICE 'Inserted return delay fine: % days × %.2f per day = %.2f',
        days_late, delay_fine_rate, delay_fine_rate * days_late;
    ELSE
      RAISE NOTICE 'Fine already exists for Borrow ID: %, skipping insert.', bid;
    END IF;
  ELSE
    RAISE NOTICE 'Return is not late for Borrow ID: % → no fine.', bid;
  END IF;
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION auto_calculate_return_delay()
RETURNS TRIGGER AS $$
BEGIN
  RAISE NOTICE 'Trigger fired for Borrow ID: %, New return date: %', NEW.borrow_id, NEW.return_date;

  IF NEW.return_date IS NOT NULL AND NEW.return_date > NEW.due_return_date THEN
    PERFORM calculate_return_delay_fine(NEW.borrow_id);
  ELSE
    RAISE NOTICE 'No delay or return_date not set → skipping fine calculation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trg_return_delay ON Borrow_record;

CREATE TRIGGER trg_return_delay
AFTER INSERT OR UPDATE OF return_date ON Borrow_record
FOR EACH ROW
WHEN (NEW.return_date IS NOT NULL AND NEW.return_date > NEW.due_return_date)
EXECUTE FUNCTION auto_calculate_return_delay();



-- Function to send notification after fine is calculated
CREATE OR REPLACE FUNCTION notify_fine_insert()
RETURNS TRIGGER AS $$
DECLARE
  mem_id INT;
  fine_type TEXT;
BEGIN
  -- Get the member ID from Borrow_record
  SELECT br.Member_id INTO mem_id
  FROM Borrow_record br
  WHERE br.Borrow_id = NEW.Borrow_id;

  -- Get the fine type for a better message
  SELECT f.Fine_type INTO fine_type
  FROM Fine f
  WHERE f.Fine_id = NEW.Fine_id;

  -- Insert a notification message
  INSERT INTO Notification (Member_id, Message, Sent_date)
  VALUES (
    mem_id,
    'You have a new fine for ' || fine_type || '. Please check your dues.',
    CURRENT_DATE
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on Fine_Calculated insert
CREATE TRIGGER trg_notify_fine
AFTER INSERT ON Fine_Calculated
FOR EACH ROW
EXECUTE FUNCTION notify_fine_insert();


