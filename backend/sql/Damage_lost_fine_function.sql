CREATE OR REPLACE FUNCTION process_lost_or_damaged(bid INT, ftype TEXT)
RETURNS VOID AS $$
DECLARE
  fine_id INT;
  rate DECIMAL(10,2);
BEGIN
  SELECT Fine_id, Daily_rate INTO fine_id, rate
  FROM Fine WHERE Fine_type = ftype;

  INSERT INTO Fine_Calculated (Fine_id, Borrow_id, Total_amount)
  VALUES (fine_id, bid, rate);
END;
$$ LANGUAGE plpgsql;
