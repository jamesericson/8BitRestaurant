CREATE TABLE dtable (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR (50) UNIQUE,
  capacity INTEGER,
  status VARCHAR(7),
  waitstaff_id INTEGER REFERENCES wait_staff(id) DEFAULT NULL
);

CREATE TABLE wait_staff (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR (50),
  last_name VARCHAR (50),
  on_duty BOOLEAN
);
