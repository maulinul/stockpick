/* src/services/gist.js - GitHub Gist API Sync */

import { ghApi } from './github.js';

export async function saveToGist({ token, gistId, gistDesc = "Log kartu saham", isPublic = false, jsonText }) {
  const filename = "kartu-saham-log.json";
  let result;
  
  if (gistId) {
    result = await ghApi(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      body: JSON.stringify({
        description: gistDesc,
        files: { [filename]: { content: jsonText } }
      })
    }, token);
  } else {
    result = await ghApi("https://api.github.com/gists", {
      method: "POST",
      body: JSON.stringify({
        description: gistDesc,
        public: isPublic,
        files: { [filename]: { content: jsonText } }
      })
    }, token);
  }

  return { gistId: result.id, url: result.html_url };
}

export async function loadFromGist({ token, gistId }) {
  if (!gistId) throw new Error("Gist ID belum diisi");
  const result = await ghApi(`https://api.github.com/gists/${gistId}`, {}, token);
  const files = Object.values(result.files || {});
  if (!files.length) throw new Error("Gist kosong");
  
  const parsed = JSON.parse(files[0].content);
  if (!Array.isArray(parsed)) throw new Error("Isi Gist bukan daftar kartu yang valid");
  return parsed;
}
