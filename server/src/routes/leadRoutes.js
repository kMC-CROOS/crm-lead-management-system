const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const query = 'SELECT * FROM leads ORDER BY created_at DESC';
    const { rows } = await db.query(query);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch leads.', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM leads WHERE id = $1', [id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch lead.', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, company, email, phone, source, salesperson, status, deal_value } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({ message: 'Name, company, and email are required.' });
    }

    const insertQuery = `
      INSERT INTO leads (name, company, email, phone, source, salesperson, status, deal_value)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      name,
      company,
      email,
      phone || null,
      source || 'Unknown',
      salesperson || null,
      status || 'New',
      Number(deal_value || 0),
    ];

    const { rows } = await db.query(insertQuery, values);
    return res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Lead email already exists.' });
    }
    return res.status(500).json({ message: 'Failed to create lead.', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, email, phone, source, salesperson, status, deal_value } = req.body;

    const updateQuery = `
      UPDATE leads
      SET
        name = $1,
        company = $2,
        email = $3,
        phone = $4,
        source = $5,
        salesperson = $6,
        status = $7,
        deal_value = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *;
    `;

    const values = [
      name,
      company,
      email,
      phone || null,
      source || 'Unknown',
      salesperson || null,
      status || 'New',
      Number(deal_value || 0),
      id,
    ];

    const { rows } = await db.query(updateQuery, values);

    if (!rows.length) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Lead email already exists.' });
    }
    return res.status(500).json({ message: 'Failed to update lead.', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM leads WHERE id = $1', [id]);

    if (!rowCount) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    return res.json({ message: 'Lead deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete lead.', error: error.message });
  }
});

router.post('/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Note content is required.' });
    }

    const leadExists = await db.query('SELECT id FROM leads WHERE id = $1', [id]);
    if (!leadExists.rows.length) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    const insertQuery = `
      INSERT INTO notes (lead_id, content, created_by)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const { rows } = await db.query(insertQuery, [id, content, req.user.email]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add note.', error: error.message });
  }
});

router.get('/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT *
      FROM notes
      WHERE lead_id = $1
      ORDER BY created_at DESC;
    `;

    const { rows } = await db.query(query, [id]);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch notes.', error: error.message });
  }
});

module.exports = router;
