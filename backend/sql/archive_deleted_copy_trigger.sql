CREATE OR REPLACE FUNCTION archive_deleted_copy()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO deleted_copies (original_copy_id, book_id)
  VALUES (OLD.copy_id, OLD.book_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_archive_copy_before_delete
BEFORE DELETE ON book_copy
FOR EACH ROW
EXECUTE FUNCTION archive_deleted_copy();
