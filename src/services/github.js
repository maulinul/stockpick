/* src/services/github.js - GitHub Repository Contents API Sync */

function b64EncodeUnicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(escape(atob(str.replace(/\n/g, ""))));
}

export async function ghApi(url, opts = {}, token) {
  if (!token) throw new Error("Token GitHub belum diisi");
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.headers || {})
    }
  });

  let body = null;
  try { body = await res.json(); } catch (e) { /* Empty ok */ }

  if (!res.ok) {
    const msg = body?.message ? body.message : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

export async function saveToRepo({ token, owner, repo, branch = "main", path = "data/kartu-saham.json", jsonText }) {
  if (!owner || !repo) throw new Error("Isi owner dan repo GitHub terlebih dahulu");
  const contentsUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  let sha = null;
  try {
    const existing = await ghApi(`${contentsUrl}?ref=${encodeURIComponent(branch)}`, {}, token);
    sha = existing?.sha;
  } catch (e) {
    // File doesn't exist yet, proceed to create new
  }

  await ghApi(contentsUrl, {
    method: "PUT",
    body: JSON.stringify({
      message: `Update log kartu saham (${new Date().toISOString().split("T")[0]})`,
      content: b64EncodeUnicode(jsonText),
      branch,
      ...(sha ? { sha } : {})
    })
  }, token);

  return { owner, repo, branch, path };
}

export async function loadFromRepo({ token, owner, repo, branch = "main", path = "data/kartu-saham.json" }) {
  if (!owner || !repo) throw new Error("Isi owner dan repo GitHub terlebih dahulu");
  const contentsUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const body = await ghApi(contentsUrl, {}, token);
  const parsed = JSON.parse(b64DecodeUnicode(body.content));
  if (!Array.isArray(parsed)) throw new Error("Isi file repo bukan daftar kartu yang valid");
  return parsed;
}
