const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const dashboardQuery = `
      SELECT
        COUNT(*)::int AS total_leads,
        COUNT(*) FILTER (WHERE status = 'New')::int AS new_leads,
        COUNT(*) FILTER (WHERE status = 'Qualified')::int AS qualified_leads,
        COUNT(*) FILTER (WHERE status = 'Won')::int AS won_leads,
        COUNT(*) FILTER (WHERE status = 'Lost')::int AS lost_leads,
        COALESCE(SUM(deal_value), 0)::numeric AS total_deal_value,
        COALESCE(SUM(deal_value) FILTER (WHERE status = 'Won'), 0)::numeric AS total_won_deal_value
      FROM leads;
    `;

    const { rows } = await db.query(dashboardQuery);

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load dashboard.', error: error.message });
  }
});

module.exports = router;
