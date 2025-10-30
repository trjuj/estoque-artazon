GET_PRODUCT = """
SELECT name, set_name, product_type, price, quantity, description, image_url
WHERE id = %s
"""

GET_ALL_PRODUCTS = """
SELECT id, name, set_name, product_type, price, quantity, description, image_url
FROM products
"""

ADD_PRODUCT = """
INSERT INTO products (name, set_name, product_type, price, quantity, description, image_url)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

UPDATE_PRODUCT = """
UPDATE products
SET name = %s, set_name = %s, product_type = %s, price = %s, quantity = %s, description = %s, image_url = %s
WHERE id = %s
"""

DELETE_PRODUCT = """
DELETE FROM products
WHERE id = %s
"""

CREATE_TABLE_PRODUCTS = """
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    set_name VARCHAR(255) NOT NULL,
    stock INT NOT NULL,
    description TEXT NULL,
    image_url VARCHAR(255) NULL
)
"""