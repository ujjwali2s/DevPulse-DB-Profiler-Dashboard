CREATE OR REPLACE PROCEDURE AddBookCopies(
    in_title TEXT,
    in_author_full TEXT,
    in_branch_id INT,
    in_copies INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_book_id INT;
    v_author_id INT;
BEGIN
    -- 1. Find the author_id by full name
    SELECT a.author_id INTO v_author_id
    FROM Author a
    JOIN Person_Info pi ON a.person_id = pi.person_id
    WHERE LOWER(CONCAT(pi.first_name, ' ', pi.last_name)) = LOWER(TRIM(in_author_full))
    LIMIT 1;

    IF v_author_id IS NULL THEN
        RAISE EXCEPTION 'Author not found';
    END IF;

    -- 2. Find the book_id by title and author
    SELECT b.book_id INTO v_book_id
    FROM Book b
    JOIN Book_Author ba ON b.book_id = ba.book_id
    WHERE ba.author_id = v_author_id AND LOWER(b.title) = LOWER(TRIM(in_title))
    LIMIT 1;

    IF v_book_id IS NULL THEN
        RAISE EXCEPTION 'Book with given title and author not found';
    END IF;

    -- 3. Insert N new Book_Copy rows
    FOR i IN 1..in_copies LOOP
        INSERT INTO Book_Copy(Book_id, Branch_id, Availability_status, Condition)
        VALUES (v_book_id, in_branch_id, 'yes', 'fair');
    END LOOP;
END;
$$;