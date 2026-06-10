CREATE OR REPLACE FUNCTION auto_calculate_return_delay()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.return_date IS NOT NULL AND NEW.return_date > NEW.due_return_date THEN
    PERFORM calculate_return_delay_fine(NEW.borrow_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_return_delay
AFTER UPDATE OF return_date ON Borrow_record
FOR EACH ROW
WHEN (NEW.return_date IS NOT NULL AND NEW.return_date > NEW.due_return_date)
EXECUTE FUNCTION auto_calculate_return_delay();
