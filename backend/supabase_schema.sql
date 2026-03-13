CREATE TABLE "user" (
	id SERIAL NOT NULL, 
	full_name VARCHAR, 
	email VARCHAR NOT NULL, 
	hashed_password VARCHAR, 
	is_active BOOLEAN, 
	is_superuser BOOLEAN, 
	role VARCHAR, 
	weight FLOAT, 
	height FLOAT, 
	age INTEGER, 
	gender VARCHAR, 
	activity_level VARCHAR, 
	goal VARCHAR, 
	plan VARCHAR, 
	image_url VARCHAR, 
	PRIMARY KEY (id)
);

CREATE TABLE client (
	id SERIAL NOT NULL, 
	expert_id INTEGER, 
	user_id INTEGER, 
	email VARCHAR, 
	name VARCHAR, 
	age INTEGER, 
	weight FLOAT, 
	height FLOAT, 
	goal VARCHAR, 
	diet VARCHAR, 
	notes VARCHAR, 
	created_at TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(expert_id) REFERENCES "user" (id), 
	FOREIGN KEY(user_id) REFERENCES "user" (id)
);

CREATE TABLE meal (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	timestamp TIMESTAMP WITHOUT TIME ZONE, 
	name VARCHAR, 
	meal_type VARCHAR, 
	image_url VARCHAR, 
	calories INTEGER, 
	protein FLOAT, 
	carbs FLOAT, 
	fats FLOAT, 
	ingredients JSON, 
	health_tip VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES "user" (id)
);

CREATE TABLE water (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	timestamp TIMESTAMP WITHOUT TIME ZONE, 
	amount INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES "user" (id)
);

CREATE TABLE journalentry (
	id SERIAL NOT NULL, 
	client_id INTEGER, 
	timestamp TIMESTAMP WITHOUT TIME ZONE, 
	name VARCHAR, 
	calories INTEGER, 
	protein FLOAT, 
	carbs FLOAT, 
	fats FLOAT, 
	meal_type VARCHAR, 
	image_url VARCHAR, 
	health_tip VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(client_id) REFERENCES client (id)
);

