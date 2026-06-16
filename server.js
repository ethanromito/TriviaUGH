const fs = require("node:fs");
const http = require("node:http");
const crypto = require("node:crypto");
const path = require("node:path");
const { URL } = require("node:url");

const PORT = Number(process.env.PORT || 8787);
const ROOT_DIR = __dirname;
const Z_DATA_DIR = "Z:\\.codex\\triviugh-temp";
const DATA_DIR = process.env.TRIVIUGH_DATA_DIR || (fs.existsSync("Z:\\") ? Z_DATA_DIR : path.join(ROOT_DIR, "data"));
const DATA_FILE = process.env.TRIVIUGH_DATA_FILE || path.join(DATA_DIR, "triviugh-db.json");
const MAX_BODY_BYTES = 1_000_000;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function makeEmptyData() {
  return {
    accounts: {},
    sessions: {},
    players: {},
    groups: {},
    memberships: {},
    results: {}
  };
}

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    return {
      ...makeEmptyData(),
      ...data,
      accounts: data.accounts || {},
      sessions: data.sessions || {},
      players: data.players || {},
      groups: data.groups || {},
      memberships: data.memberships || {},
      results: data.results || {}
    };
  } catch {
    return makeEmptyData();
  }
}

function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`);
}

function jsonResponse(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  response.end(JSON.stringify(payload));
}

function notFound(response) {
  jsonResponse(response, 404, { error: "Not found" });
}

function cleanName(value, max = 28) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .slice(0, 120);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail(value));
}

function isValidPassword(value) {
  return String(value || "").length >= 6;
}

function makeAccountPlayerId(email) {
  const digest = crypto.createHash("sha256").update(cleanEmail(email)).digest("hex").slice(0, 24);
  return `acct-${digest}`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(String(password), salt, 120_000, 32, "sha256").toString("hex");
  return { salt, hash };
}

function verifyPassword(password, account) {
  if (!account?.salt || !account?.passwordHash) return false;
  const { hash } = hashPassword(password, account.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(account.passwordHash, "hex"));
}

function makeSession(data, account) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 90).toISOString();
  data.sessions[token] = {
    token,
    email: account.email,
    playerId: account.playerId,
    createdAt: now.toISOString(),
    expiresAt
  };
  return data.sessions[token];
}

function getSession(data, request) {
  const header = request.headers.authorization || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const session = data.sessions[token];
  if (!session) return null;
  if (Date.parse(session.expiresAt) < Date.now()) {
    delete data.sessions[token];
    writeData(data);
    return null;
  }
  return session;
}

function getPlayerGroups(data, playerId) {
  const cleanPlayerId = validatePlayerId(playerId);
  return Object.values(data.memberships)
    .flatMap((members) => Object.values(members || {}))
    .filter((membership) => membership.playerId === cleanPlayerId)
    .map((membership) => data.groups[membership.groupCode])
    .filter(Boolean)
    .sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
}

function makeAccountPayload(data, account, session) {
  const player = data.players[account.playerId];
  const results = getPlayerResults(data, account.playerId);
  const groups = getPlayerGroups(data, account.playerId);
  const activeGroup = player?.activeGroup && data.groups[player.activeGroup]
    ? player.activeGroup
    : groups[0]?.code || null;

  return {
    token: session?.token,
    account: {
      email: account.email,
      playerId: account.playerId
    },
    player,
    groups,
    activeGroup,
    results
  };
}

function normalizeGroupCode(value) {
  const raw = String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const stripped = raw.startsWith("TRV") ? raw.slice(3) : raw;
  if (stripped.length < 4) return "";
  return `TRV-${stripped.slice(0, 4)}`;
}

function makeDefaultGroupName(code) {
  const suffix = String(code || "")
    .replace(/^TRV-?/, "")
    .slice(0, 4);
  return suffix ? `Group ${suffix}` : "My group";
}

function validatePlayerId(value) {
  const id = String(value || "").trim();
  return /^[a-zA-Z0-9_.:-]{6,80}$/.test(id) ? id : "";
}

function validateDateKey(value) {
  const date = String(value || "");
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    request.on("error", reject);
  });
}

function ensurePlayer(data, id, name) {
  const now = new Date().toISOString();
  const cleanId = validatePlayerId(id);
  if (!cleanId) return null;
  const existing = data.players[cleanId] || {};
  data.players[cleanId] = {
    id: cleanId,
    name: cleanName(name, 18) || existing.name || "Player",
    activeGroup: existing.activeGroup || null,
    createdAt: existing.createdAt || now,
    updatedAt: now
  };
  return data.players[cleanId];
}

function ensureGroup(data, code, name, ownerId) {
  const groupCode = normalizeGroupCode(code);
  if (!groupCode) return null;
  const now = new Date().toISOString();
  const existing = data.groups[groupCode] || {};
  data.groups[groupCode] = {
    code: groupCode,
    name: cleanName(name) || existing.name || makeDefaultGroupName(groupCode),
    ownerId: validatePlayerId(ownerId) || existing.ownerId || null,
    createdAt: existing.createdAt || now,
    updatedAt: now
  };
  return data.groups[groupCode];
}

function ensureMembership(data, code, playerId) {
  const groupCode = normalizeGroupCode(code);
  const cleanPlayerId = validatePlayerId(playerId);
  if (!groupCode || !cleanPlayerId || !data.groups[groupCode] || !data.players[cleanPlayerId]) return null;
  data.memberships[groupCode] ||= {};
  data.memberships[groupCode][cleanPlayerId] ||= {
    groupCode,
    playerId: cleanPlayerId,
    joinedAt: new Date().toISOString()
  };
  if (data.players[cleanPlayerId]) {
    data.players[cleanPlayerId].activeGroup = groupCode;
    data.players[cleanPlayerId].updatedAt = new Date().toISOString();
  }
  return data.memberships[groupCode][cleanPlayerId];
}

function getPlayerResults(data, playerId) {
  const cleanPlayerId = validatePlayerId(playerId);
  const playerResults = cleanPlayerId ? data.results[cleanPlayerId] || {} : {};
  return Object.values(playerResults).sort((a, b) => b.date.localeCompare(a.date));
}

function getLeaderboard(data, code) {
  const groupCode = normalizeGroupCode(code);
  const memberIds = new Set(Object.keys(data.memberships[groupCode] || {}));
  Object.entries(data.results).forEach(([playerId, days]) => {
    if (Object.values(days).some((entry) => entry.groupCode === groupCode)) {
      memberIds.add(playerId);
    }
  });

  return [...memberIds]
    .map((playerId) => {
      const days = Object.values(data.results[playerId] || {}).filter((entry) => entry.groupCode === groupCode);
      const total = days.reduce((sum, entry) => sum + Number(entry.score || 0), 0);
      return {
        playerId,
        name: data.players[playerId]?.name || "Player",
        total,
        plays: days.length
      };
    })
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}

async function handleApi(request, response, url) {
  if (request.method === "OPTIONS") {
    jsonResponse(response, 204, {});
    return;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const data = readData();

  if (request.method === "GET" && url.pathname === "/api/health") {
    jsonResponse(response, 200, { ok: true, dataFile: DATA_FILE });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/signup") {
    const body = await readBody(request);
    const email = cleanEmail(body.email);
    if (!isValidEmail(email) || !isValidPassword(body.password)) {
      jsonResponse(response, 400, { error: "Enter a valid email and a password with at least 6 characters" });
      return;
    }
    if (data.accounts[email]) {
      jsonResponse(response, 409, { error: "Account already exists" });
      return;
    }

    const playerId = makeAccountPlayerId(email);
    const password = hashPassword(body.password);
    const now = new Date().toISOString();
    data.accounts[email] = {
      email,
      playerId,
      passwordHash: password.hash,
      salt: password.salt,
      createdAt: now,
      updatedAt: now
    };
    ensurePlayer(data, playerId, body.name);
    const session = makeSession(data, data.accounts[email]);
    writeData(data);
    jsonResponse(response, 200, makeAccountPayload(data, data.accounts[email], session));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/login") {
    const body = await readBody(request);
    const email = cleanEmail(body.email);
    const account = data.accounts[email];
    if (!account || !verifyPassword(body.password, account)) {
      jsonResponse(response, 401, { error: "Email or password not found" });
      return;
    }

    ensurePlayer(data, account.playerId, body.name || data.players[account.playerId]?.name);
    const session = makeSession(data, account);
    account.updatedAt = new Date().toISOString();
    writeData(data);
    jsonResponse(response, 200, makeAccountPayload(data, account, session));
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/auth/session") {
    const session = getSession(data, request);
    const account = session ? data.accounts[session.email] : null;
    if (!session || !account) {
      jsonResponse(response, 401, { error: "Not signed in" });
      return;
    }
    jsonResponse(response, 200, makeAccountPayload(data, account, session));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/logout") {
    const session = getSession(data, request);
    if (session) {
      delete data.sessions[session.token];
      writeData(data);
    }
    jsonResponse(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/players") {
    const body = await readBody(request);
    const player = ensurePlayer(data, body.id, body.name);
    if (!player) {
      jsonResponse(response, 400, { error: "Invalid player" });
      return;
    }
    writeData(data);
    jsonResponse(response, 200, { player });
    return;
  }

  if (request.method === "GET" && parts[1] === "players" && parts[3] === "results") {
    const playerId = decodeURIComponent(parts[2] || "");
    jsonResponse(response, 200, { results: getPlayerResults(data, playerId) });
    return;
  }

  if (request.method === "GET" && parts[1] === "players" && parts[3] === "groups") {
    const playerId = decodeURIComponent(parts[2] || "");
    const player = data.players[validatePlayerId(playerId)];
    jsonResponse(response, 200, {
      activeGroup: player?.activeGroup || null,
      groups: getPlayerGroups(data, playerId)
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/groups") {
    const body = await readBody(request);
    const group = ensureGroup(data, body.code, body.name, body.ownerId);
    if (!group) {
      jsonResponse(response, 400, { error: "Invalid group" });
      return;
    }
    if (validatePlayerId(body.ownerId) && data.players[body.ownerId]) {
      ensureMembership(data, group.code, body.ownerId);
    }
    writeData(data);
    jsonResponse(response, 200, { group });
    return;
  }

  if (request.method === "GET" && parts[1] === "groups" && parts.length === 3) {
    const code = normalizeGroupCode(decodeURIComponent(parts[2] || ""));
    const group = data.groups[code];
    if (!group) {
      jsonResponse(response, 404, { error: "Group Not Found" });
      return;
    }
    jsonResponse(response, 200, { group });
    return;
  }

  if (request.method === "POST" && parts[1] === "groups" && parts[3] === "members") {
    const code = decodeURIComponent(parts[2] || "");
    const body = await readBody(request);
    const membership = ensureMembership(data, code, body.playerId);
    if (!membership) {
      jsonResponse(response, 404, { error: "Group Not Found" });
      return;
    }
    writeData(data);
    jsonResponse(response, 200, { membership });
    return;
  }

  if (request.method === "GET" && parts[1] === "groups" && parts[3] === "leaderboard") {
    const code = decodeURIComponent(parts[2] || "");
    const groupCode = normalizeGroupCode(code);
    if (!data.groups[groupCode]) {
      jsonResponse(response, 404, { error: "Group Not Found" });
      return;
    }
    jsonResponse(response, 200, { entries: getLeaderboard(data, groupCode) });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/results") {
    const body = await readBody(request);
    const playerId = validatePlayerId(body.playerId);
    const result = body.result || {};
    const date = validateDateKey(result.date);
    const groupCode = normalizeGroupCode(result.groupCode);
    if (!playerId || !date || !groupCode || !data.players[playerId] || !data.groups[groupCode]) {
      jsonResponse(response, 400, { error: "Invalid result" });
      return;
    }
    data.results[playerId] ||= {};
    if (data.results[playerId][date]) {
      jsonResponse(response, 409, { error: "Already played today", result: data.results[playerId][date] });
      return;
    }
    const safeResult = {
      ...result,
      date,
      groupCode,
      score: Math.max(0, Math.min(30, Number(result.score || 0))),
      possible: Math.max(0, Math.min(30, Number(result.possible || 30))),
      details: Array.isArray(result.details) ? result.details : [],
      submittedAt: result.submittedAt || new Date().toISOString()
    };
    data.results[playerId][date] = safeResult;
    ensureMembership(data, groupCode, playerId);
    writeData(data);
    jsonResponse(response, 200, { result: safeResult });
    return;
  }

  notFound(response);
}

function serveStatic(request, response, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const absolutePath = path.normalize(path.join(ROOT_DIR, requestedPath));
  if (!absolutePath.startsWith(ROOT_DIR)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(absolutePath, (error, contents) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(absolutePath)] || "application/octet-stream"
    });
    response.end(contents);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }
    serveStatic(request, response, url);
  } catch (error) {
    jsonResponse(response, error.message === "Request body too large" ? 413 : 500, {
      error: error.message || "Server error"
    });
  }
});

server.listen(PORT, () => {
  console.log(`Trivi-Ugh website and backend running at http://localhost:${PORT}`);
  console.log(`Shared data file: ${DATA_FILE}`);
});
