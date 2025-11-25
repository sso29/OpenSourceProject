/* Fetch Spotify album covers for OST tracks and update ostMap.json.
 *
 * Usage:
 *   node scripts/fetchOstCovers.js
 *
 * Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env (repo root)
 * or environment variables. Writes covers back into Frontend/src/data/ostMap.json.
 */

import fs from "fs/promises";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");
const envPath = path.join(rootDir, ".env");
const ostMapPath = path.join(__dirname, "..", "src", "data", "ostMap.json");

const parseEnvFile = async (filepath) => {
  try {
    const raw = await fs.readFile(filepath, "utf8");
    const lines = raw.split("\n");
    const out = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        out[key] = val;
      }
    }
    return out;
  } catch (err) {
    console.warn(`.env not read (${filepath}): ${err.message}`);
    return {};
  }
};

const getToken = async (clientId, clientSecret) => {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token fetch failed ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.access_token;
};

const searchTrack = async (token, title, artist) => {
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("type", "track");
  url.searchParams.set("limit", "3");
  url.searchParams.set("q", `track:${title} artist:${artist}`);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Search failed ${res.status}: ${text}`);
  }
  const data = await res.json();
  const track = data.tracks?.items?.[0];
  if (!track) return null;
  const cover = track.album?.images?.[0]?.url || null;
  return {
    cover,
    spotifyUrl: track.external_urls?.spotify || null,
  };
};

const main = async () => {
  const envVars = await parseEnvFile(envPath);
  const clientId = process.env.SPOTIFY_CLIENT_ID || envVars.SPOTIFY_CLIENT_ID;
  const clientSecret =
    process.env.SPOTIFY_CLIENT_SECRET || envVars.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is missing.");
  }

  const ostMapRaw = JSON.parse(await fs.readFile(ostMapPath, "utf8"));
  const token = await getToken(clientId, clientSecret);
  console.log("Spotify token acquired. Searching tracks...");

  let totalTracks = 0;
  let coverHits = 0;
  const updated = {};

  for (const [contentTitle, tracks] of Object.entries(ostMapRaw)) {
    updated[contentTitle] = [];
    for (const track of tracks) {
      totalTracks += 1;
      const { title, artist } = track;
      try {
        const result = await searchTrack(token, title, artist);
        if (result?.cover) coverHits += 1;
        updated[contentTitle].push({
          ...track,
          cover: result?.cover || null,
          spotifyUrl: result?.spotifyUrl || null,
        });
        console.log(
          `[OK] ${contentTitle} - ${title} (${artist}) -> ${
            result?.cover ? "cover found" : "no cover"
          }`
        );
      } catch (err) {
        console.warn(
          `[SKIP] ${contentTitle} - ${title} (${artist}): ${err.message}`
        );
        updated[contentTitle].push({ ...track, cover: null, spotifyUrl: null });
      }
    }
  }

  await fs.writeFile(ostMapPath, JSON.stringify(updated, null, 2), "utf8");
  console.log(
    `Updated ${ostMapPath}. Covers found: ${coverHits}/${totalTracks}.`
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
