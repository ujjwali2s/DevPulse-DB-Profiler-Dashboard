const express = require('express');
const router = express.Router();
const pool = require('../db/client');
const fs = require('fs');
const path = require('path');



const buildDateFilter = (startDate, endDate, dateColumn = 'created_at') => {
  if (startDate && endDate) {
    return `AND ${dateColumn} BETWEEN '${startDate}' AND '${endDate}'`;
  }
  return '';
};


const buildMonthYearFilter = (month, year, dateColumn = 'created_at') => {
  if (month && year) {
    return `AND EXTRACT(MONTH FROM ${dateColumn}) = ${month} AND EXTRACT(YEAR FROM ${dateColumn}) = ${year}`;
  } else if (year) {
    return `AND EXTRACT(YEAR FROM ${dateColumn}) = ${year}`;
  }
  return '';
};

// Most Popular Books (by borrowing frequency)
router.get('/popular-books', async (req, res) => {
  try {
    const { startDate, endDate, month, year, limit = 10 } = req.query;
    
    const dateFilter = startDate && endDate 
      ? buildDateFilter(startDate, endDate, 'br.borrow_date')
      : buildMonthYearFilter(month, year, 'br.borrow_date');

    const query = `
          SELECT 
            b.book_id AS id,
            b.title AS title,
            STRING_AGG(CONCAT(p.first_name, ' ', p.last_name), ', ') AS authors,
            b.ISBN,
            COUNT(br.Borrow_id) AS borrow_count,
            ROUND(AVG(r.Rating), 2) AS avg_rating
        FROM Book b
        LEFT JOIN Book_Copy bc ON b.Book_id = bc.Book_id
        LEFT JOIN Borrow_record br ON bc.Copy_id = br.Copy_id
        LEFT JOIN Review r ON b.Book_id = r.Book_id
        LEFT JOIN Book_Author ba ON b.Book_id = ba.Book_id
        LEFT JOIN Author a ON ba.Author_id = a.Author_id
        LEFT JOIN Person_Info p ON a.Person_id = p.Person_id
        WHERE 1=1 ${dateFilter}
        GROUP BY b.Book_id, b.Title, b.ISBN
        ORDER BY borrow_count DESC
        LIMIT $1

        `;

    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching popular books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Most Requested Books (by reservation frequency)
router.get('/requested-books', async (req, res) => {
  try {
    const { startDate, endDate, month, year, limit = 10 } = req.query;
    
    const dateFilter = startDate && endDate 
      ? buildDateFilter(startDate, endDate, 'br.request_date')
      : buildMonthYearFilter(month, year, 'br.request_date');

    const query = `
        SELECT 
        b.Book_id AS id,
        b.Title,
        STRING_AGG(CONCAT(p.First_Name, ' ', p.Last_Name), ', ') AS authors,
        b.ISBN,
        COUNT(br.Req_id) AS request_count,
        COUNT(CASE WHEN br.Request_status = 'approved' THEN 1 END) AS fulfilled_count
        FROM Book b
        LEFT JOIN Book_request br ON b.Book_id = br.Book_id
        LEFT JOIN Book_Author ba ON b.Book_id = ba.Book_id
        LEFT JOIN Author a ON ba.Author_id = a.Author_id
        LEFT JOIN Person_Info p ON a.Person_id = p.Person_id
        WHERE 1=1 ${dateFilter}
        GROUP BY b.Book_id, b.Title, b.ISBN
        ORDER BY request_count DESC
        LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching requested books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Books with High Demand but Low Availability
router.get('/unmet-demand', async (req, res) => {
  try {
    const { startDate, endDate, month, year, limit = 10 } = req.query;
    
    const dateFilter = startDate && endDate 
      ? buildDateFilter(startDate, endDate, 'br.request_date')
      : buildMonthYearFilter(month, year, 'br.request_date');

    const query = `
      SELECT 
        b.Book_id AS id,
        b.Title,
        STRING_AGG(CONCAT(p.First_Name, ' ', p.Last_Name), ', ') AS authors,
        b.ISBN,
        COUNT(br.Req_id) AS total_requests,
        COUNT(CASE WHEN br.Request_status IN ('pending', 'rejected') THEN 1 END) AS unmet_requests,
        ROUND(
            (COUNT(CASE WHEN br.Request_status IN ('pending', 'rejected') THEN 1 END) * 100.0 / COUNT(br.Req_id)), 2
        ) AS unmet_percentage
        FROM Book b
        LEFT JOIN Book_request br ON b.Book_id = br.Book_id
        LEFT JOIN Book_Author ba ON b.Book_id = ba.Book_id
        LEFT JOIN Author a ON ba.Author_id = a.Author_id
        LEFT JOIN Person_Info p ON a.Person_id = p.Person_id
        WHERE 1=1 ${dateFilter}
        GROUP BY b.Book_id, b.Title, b.ISBN
        HAVING COUNT(br.Req_id) > 0
        ORDER BY unmet_percentage DESC, total_requests DESC
        LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching unmet demand books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Most Popular Genres
router.get('/popular-genres', async (req, res) => {
  try {
    const { startDate, endDate, month, year, limit = 10 } = req.query;
    
    const dateFilter = startDate && endDate 
      ? buildDateFilter(startDate, endDate, 'br.borrow_date')
      : buildMonthYearFilter(month, year, 'br.borrow_date');

    const query = `
      SELECT 
        g.Name AS genre,
        COUNT(br.Borrow_id) AS borrow_count,
        COUNT(DISTINCT b.Book_id) AS unique_books,
        ROUND(AVG(r.Rating), 2) AS avg_rating
        FROM Book b
        LEFT JOIN Book_Genre bg ON b.Book_id = bg.Book_id
        LEFT JOIN Genre g ON bg.Genre_id = g.Genre_id
        LEFT JOIN Book_Copy bc ON b.Book_id = bc.Book_id
        LEFT JOIN Borrow_record br ON bc.Copy_id = br.Copy_id
        LEFT JOIN Review r ON b.Book_id = r.Book_id
        WHERE g.Name IS NOT NULL ${dateFilter}
        GROUP BY g.Name
        ORDER BY borrow_count DESC
        LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching popular genres:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Most Popular Authors
router.get('/popular-authors', async (req, res) => {
  try {
    const { startDate, endDate, month, year, limit = 10 } = req.query;
    
    const dateFilter = startDate && endDate 
      ? buildDateFilter(startDate, endDate, 'br.borrow_date')
      : buildMonthYearFilter(month, year, 'br.borrow_date');

    const query = `
      SELECT 
        CONCAT(p.First_Name, ' ', p.Last_Name) AS author,
        COUNT(br.Borrow_id) AS borrow_count,
        COUNT(DISTINCT b.Book_id) AS unique_books,
        ROUND(AVG(r.Rating), 2) AS avg_rating
        FROM Book b
        LEFT JOIN Book_Author ba ON b.Book_id = ba.Book_id
        LEFT JOIN Author a ON ba.Author_id = a.Author_id
        LEFT JOIN Person_Info p ON a.Person_id = p.Person_id
        LEFT JOIN Book_Copy bc ON b.Book_id = bc.Book_id
        LEFT JOIN Borrow_record br ON bc.Copy_id = br.Copy_id
        LEFT JOIN Review r ON b.Book_id = r.Book_id
        WHERE p.Person_id IS NOT NULL ${dateFilter}
        GROUP BY author
        ORDER BY borrow_count DESC
        LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching popular authors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Most Rated Books
router.get('/rated-books', async (req, res) => {
  try {
    const { startDate, endDate, month, year, limit = 10, minRatings = 5 } = req.query;
    
    const dateFilter = startDate && endDate 
      ? buildDateFilter(startDate, endDate, 'br.created_at')
      : buildMonthYearFilter(month, year, 'br.created_at');

    const query = `
      SELECT 
        b.Book_id AS id,
        b.Title,
        STRING_AGG(DISTINCT g.Name, ', ') AS genres,
        STRING_AGG(DISTINCT CONCAT(p.First_Name, ' ', p.Last_Name), ', ') AS authors,
        b.ISBN,
        COUNT(r.Review_id) AS rating_count,
        ROUND(AVG(r.Rating), 2) AS avg_rating,
        COUNT(br.Borrow_id) AS borrow_count
        FROM Book b
        LEFT JOIN Book_Genre bg ON b.Book_id = bg.Book_id
        LEFT JOIN Genre g ON bg.Genre_id = g.Genre_id
        LEFT JOIN Review r ON b.Book_id = r.Book_id
        LEFT JOIN Book_Copy bc ON b.Book_id = bc.Book_id
        LEFT JOIN Borrow_record br ON bc.Copy_id = br.Copy_id
        LEFT JOIN Book_Author ba ON b.Book_id = ba.Book_id
        LEFT JOIN Author a ON ba.Author_id = a.Author_id
        LEFT JOIN Person_Info p ON a.Person_id = p.Person_id
        WHERE 1=1 ${dateFilter}
        GROUP BY b.Book_id, b.Title, b.ISBN
        HAVING COUNT(r.Review_id) >= $2
        ORDER BY avg_rating DESC, rating_count DESC
        LIMIT $1
    `;

    const result = await pool.query(query, [limit, minRatings]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching rated books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Statistics Overview
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate, month, year } = req.query;
    
    const dateFilter = startDate && endDate 
      ? buildDateFilter(startDate, endDate, 'br.borrow_date')
      : buildMonthYearFilter(month, year, 'br.borrow_date');

    const overviewQuery = `
      SELECT 
        (SELECT COUNT(*) FROM Book_copy) AS total_books,
        (SELECT COUNT(*) FROM Member) AS total_members,
        (SELECT COUNT(*) FROM Borrow_record WHERE 1=1 ${dateFilter}) AS total_borrowings,
        (SELECT COUNT(*) FROM Book_request WHERE 1=1 ${dateFilter}) AS total_reservations,
        (SELECT COUNT(*) FROM Review WHERE 1=1 ${dateFilter}) AS total_reviews,
        (SELECT ROUND(AVG(Rating), 2) FROM Review WHERE 1=1 ${dateFilter}) AS avg_rating
    `;

    const result = await pool.query(overviewQuery);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Monthly/Yearly Trends
router.get('/trends', async (req, res) => {
  try {
    const { year, type = 'monthly' } = req.query;
    
    let groupBy, dateFormat;
    if (type === 'monthly') {
      groupBy = 'EXTRACT(YEAR FROM br.borrow_date), EXTRACT(MONTH FROM br.borrow_date)';
      dateFormat = 'TO_CHAR(br.borrow_date, \'YYYY-MM\')';
    } else {
      groupBy = 'EXTRACT(YEAR FROM br.borrow_date)';
      dateFormat = 'EXTRACT(YEAR FROM br.borrow_date)';
    }

    const yearFilter = year ? `AND EXTRACT(YEAR FROM br.borrow_date) = ${year}` : '';

    const query = `
      SELECT 
        ${dateFormat} AS period,
        COUNT(br.Borrow_id) AS borrowings,
        COUNT(DISTINCT br.Member_id) AS active_members,
        COUNT(DISTINCT bc.Book_id) AS books_borrowed
        FROM Borrow_record br
        LEFT JOIN Book_Copy bc ON br.Copy_id = bc.Copy_id
        WHERE 1=1 ${yearFilter}
        GROUP BY ${groupBy}
        ORDER BY period
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;