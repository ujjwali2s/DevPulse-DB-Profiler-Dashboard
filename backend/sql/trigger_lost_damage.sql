CREATE OR REPLACE FUNCTION process_lost_or_damaged(bid INT, ftype TEXT)
RETURNS VOID AS $$
DECLARE
  ld_fine_id INT;
  rate DECIMAL(10,2);
  copyId INT;
BEGIN
  SELECT f.Fine_id, f.Daily_rate INTO ld_fine_id, rate
  FROM Fine f
  WHERE f.Fine_type = ftype;

  SELECT br.copy_id INTO copyId
  FROM Borrow_record br
  WHERE br.borrow_id = bid;

  IF ftype = 'Book_lost' THEN
    UPDATE Book_Copy
    SET condition = 'lost',
        availability_status = 'no'
    WHERE copy_id = copyId;

  ELSIF ftype = 'Damaged' THEN
    UPDATE Book_Copy
    SET condition = 'worn',
        availability_status = 'yes'
    WHERE copy_id = copyId;
  END IF;

  INSERT INTO Fine_Calculated (Fine_id, Borrow_id, Total_amount)
  VALUES (ld_fine_id, bid, rate);
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION auto_handle_lost_or_damaged()
RETURNS TRIGGER AS $$
DECLARE
  ftype TEXT;
  cond TEXT;
BEGIN
  IF NEW.status = 'approved' THEN
    RAISE NOTICE 'Trigger fired for request ID: %, Borrow ID: %', NEW.request_id, NEW.borrow_id;

    IF NEW.request_type = 'lost' THEN
      ftype := 'Book_lost';
      RAISE NOTICE 'Request type is lost → Fine type set to Book_lost';

    ELSE
      SELECT return_condition INTO cond
      FROM Borrow_record
      WHERE borrow_id = NEW.borrow_id;

      RAISE NOTICE 'Fetched return condition: %', cond;

      IF LOWER(cond) = 'damaged' THEN
        ftype := 'Damaged';
        RAISE NOTICE 'Condition is damaged → Fine type set to Damaged';
      ELSE
        RAISE NOTICE 'Condition is okay or not handled → No fine will be inserted';
      END IF;
    END IF;

    IF ftype IS NOT NULL THEN
      RAISE NOTICE 'Calling process_lost_or_damaged() with fine type: %', ftype;
      PERFORM process_lost_or_damaged(NEW.borrow_id, ftype);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

drop trigger if exists trg_process_lost_damaged on return_lost_requests;

CREATE TRIGGER trg_process_lost_damaged
AFTER UPDATE OF status ON return_lost_requests
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION auto_handle_lost_or_damaged();



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


