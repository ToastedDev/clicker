CREATE TABLE clicks (
  id TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

INSERT INTO clicks (id) VALUES ("toasted-clicker");

CREATE TABLE history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clicker_id TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX history_clicker_id_idx ON history (clicker_id);

CREATE TABLE country_clicks {
  id TEXT PRIMARY KEY,
  clicker_id TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0
}

CREATE INDEX country_clicks_clicker_id_idx ON country_clicks (clicker_id);