/* -------------------------
  SHARED CONTEXT
---------------------------- */

CREATE TABLE shared__failover_domain_events (
	id INT AUTO_INCREMENT PRIMARY KEY,
	eventId UUID NOT NULL,
	eventName VARCHAR(255) NOT NULL,
	body TEXT NOT NULL
);


/* -------------------------
  SELLER BACKOFFICE CONTEXT
---------------------------- */

CREATE TABLE seller_backoffice__products (
	id UUID PRIMARY KEY,
	name VARCHAR(255),
	price_amount DECIMAL(10, 2),
	price_currency CHAR(3),
	image_urls JSON,
	views INT,
	creation_date TIMESTAMP
);


/* -------------------------
        SHOP CONTEXT
---------------------------- */

CREATE TABLE shop__users (
	id UUID PRIMARY KEY,
	name VARCHAR(255),
	email VARCHAR(255),
	profile_picture VARCHAR(255)
);

CREATE TABLE shop__product_reviews (
	id UUID PRIMARY KEY,
	user_id UUID REFERENCES shop__users(id),
	product_id UUID REFERENCES seller_backoffice__products(id),
	rating FLOAT,
	comment VARCHAR(500),
	is_featured BOOLEAN DEFAULT FALSE
);

CREATE VIEW shop__products__view AS
SELECT p.id,
	   p.name,
	   p.price_amount,
	   p.price_currency,
	   p.image_urls,
	   JSON_OBJECT(
			   'comment', MAX(IF(r.is_featured = 1, r.comment, NULL)),
			   'rating', MAX(IF(r.is_featured = 1, r.rating, NULL))
	   )             AS featured_review,
	   AVG(r.rating) AS rating
FROM seller_backoffice__products p
		 LEFT JOIN shop__product_reviews r ON p.id = r.product_id
GROUP BY p.id;
