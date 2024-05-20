CREATE TABLE clicks (
  id TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

INSERT INTO clicks (id) VALUES ("toasted-clicker");