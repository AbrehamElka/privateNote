CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	firstname varchar(20) NOT NULL,
	lastname varchar(20) NOT NULL,
	email varchar(20) UNIQUE NOT NULL,
	userPassword text NOT NULL
);

CREATE TABLE notes (
	id SERIAL PRIMARY KEY,
	title varchar(50) NOT NULL,
	noteContent text,
	userid SERIAL REFERENCES users(id),
	active BOOLEAN NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	last_updated TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$ 
	BEGIN
		NEW.last_updated = CURRENT_TIMESTAMP;
		RETURN NEW;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_last_updated
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();