export const LEADS_KEY = 'crm_leads';

const initialLeads = [
  {
    id: crypto.randomUUID(),
    name: 'John Doe',
    company: 'Acme Corp',
    email: 'john@acme.com',
    phone: '+1 555-123-4567',
    source: 'Website',
    salesperson: 'Alice Johnson',
    status: 'New',
    dealValue: 5000,
    createdAt: '2024-05-18T10:00:00.000Z',
    notes: [
      {
        id: crypto.randomUUID(),
        content: 'Requested product demo for next week.',
        createdBy: 'Admin',
        createdAt: '2024-05-18T11:10:00.000Z',
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Sarah Smith',
    company: 'Globex Inc',
    email: 'sarah@globex.com',
    phone: '+1 555-987-6543',
    source: 'LinkedIn',
    salesperson: 'Bob Williams',
    status: 'Contacted',
    dealValue: 7500,
    createdAt: '2024-05-17T10:00:00.000Z',
    notes: [],
  },
  {
    id: crypto.randomUUID(),
    name: 'Michael Brown',
    company: 'Initech',
    email: 'michael@initech.com',
    phone: '+1 555-456-7890',
    source: 'Referral',
    salesperson: 'Alice Johnson',
    status: 'Qualified',
    dealValue: 12000,
    createdAt: '2024-05-16T09:00:00.000Z',
    notes: [],
  },
];


export function getLeads() {
  const stored = localStorage.getItem(LEADS_KEY);
  if (!stored) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(initialLeads));
    return initialLeads;
  }
  return JSON.parse(stored);
}

function saveLeads(leads) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export function createLead(payload) {
  const leads = getLeads();
  const lead = {
    ...payload,
    id: crypto.randomUUID(),
    dealValue: Number(payload.dealValue),
    createdAt: new Date().toISOString(),
    notes: [],
  };
  leads.unshift(lead);
  saveLeads(leads);
  return lead;
}

export function updateLead(id, payload) {
  const leads = getLeads();
  const next = leads.map((lead) =>
    lead.id === id
      ? { ...lead, ...payload, dealValue: Number(payload.dealValue), updatedAt: new Date().toISOString() }
      : lead
  );
  saveLeads(next);
}

export function deleteLead(id) {
  const leads = getLeads().filter((lead) => lead.id !== id);
  saveLeads(leads);
}

export function getLeadById(id) {
  return getLeads().find((lead) => lead.id === id) || null;
}

export function addNote(leadId, content) {
  const leads = getLeads();
  const next = leads.map((lead) => {
    if (lead.id !== leadId) {
      return lead;
    }

    const notes = [
      {
        id: crypto.randomUUID(),
        content,
        createdBy: 'Admin',
        createdAt: new Date().toISOString(),
      },
      ...(lead.notes || []),
    ];

    return { ...lead, notes };
  });

  saveLeads(next);
}
