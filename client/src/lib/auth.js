export const TOKEN_KEY = 'crm_token';
export const USER_KEY = 'crm_user';
export const USERS_KEY = 'crm_users';

const defaultUsers = [
  { id: crypto.randomUUID(), name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active', password: 'password123', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: 'Alice Johnson', email: 'alice@salescrm.com', role: 'Salesperson', status: 'Active', password: 'password123', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: 'Bob Williams', email: 'bob@salescrm.com', role: 'Salesperson', status: 'Active', password: 'password123', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: 'Charlie Lee', email: 'charlie@salescrm.com', role: 'Salesperson', status: 'Active', password: 'password123', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: 'David Brown', email: 'david@salescrm.com', role: 'Salesperson', status: 'Active', password: 'password123', createdAt: new Date().toISOString() },
];

export function getUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY) && !!localStorage.getItem(USER_KEY);
}

export function login(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.status !== 'Active') {
    throw new Error('This account is inactive');
  }

  // Omit password from stored user
  const { password: _, ...userWithoutPassword } = user;
  
  localStorage.setItem(TOKEN_KEY, 'dummy-jwt-token-' + Date.now());
  localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
}

export function register({ name, email, password, role }) {
  const users = getUsers();
  
  if (users.some(u => u.email === email)) {
    throw new Error('Email is already registered');
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password, // Storing plain text just for demo purposes
    role: role || 'Salesperson',
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  
  return newUser;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('user');
  localStorage.removeItem('currentUser');
  localStorage.removeItem(USER_KEY);
}

export function forgotPassword(email) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('No account found with this email.');
  }
  
  // Simulate sending email
  return true;
}

export function googleSignIn() {
  const user = {
    id: 'google-' + crypto.randomUUID(),
    name: 'Google User',
    email: 'googleuser@example.com',
    role: 'Salesperson',
    status: 'Active'
  };

  localStorage.setItem(TOKEN_KEY, 'google-dummy-jwt-token-' + Date.now());
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  
  return user;
}

export function addUser(payload) {
  const users = getUsers();
  if (users.some(u => u.email === payload.email)) {
    throw new Error('Email already exists');
  }
  
  const newUser = {
    ...payload,
    id: crypto.randomUUID(),
    password: payload.password || 'password123', // Default password if not provided
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id, payload) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) throw new Error('User not found');
  
  // Check email collision
  if (payload.email && payload.email !== users[index].email) {
    if (users.some(u => u.email === payload.email)) {
      throw new Error('Email already in use');
    }
  }

  users[index] = { ...users[index], ...payload, updatedAt: new Date().toISOString() };
  saveUsers(users);
  return users[index];
}

export function deleteUser(id) {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  saveUsers(filtered);
}
