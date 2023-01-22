const db = require("../database/db.js");

module.exports = { listProducts, getProduct, searchProducts, createProduct };

const select_products = db.prepare(/*sql*/ `
  SELECT
    id,
    name,
    quantity_per_unit,
    FORMAT('£%.2f', unit_price) AS unit_price,
    units_in_stock,
    FORMAT('£%.2f', unit_price * units_in_stock) AS stock_value,
    units_on_order
  FROM products
`);

function listProducts() {
  return select_products.all();
}

const select_product = db.prepare(/*sql*/ `
  SELECT
    products.id,
    products.name,
    categories.name AS category_name,
    categories.description AS category_description
  FROM products
  JOIN categories ON products.category_id = categories.id
  WHERE products.id = ?
`);

function getProduct(id) {
  return select_product.get(id);
}

const search_products = db.prepare(/*sql*/ `
  SELECT
    id,
    name
  FROM products
  WHERE name LIKE ?
`);

function searchProducts(search_term) {
  return search_products.all("%" + search_term + "%");
}

// Added in unit price that wasn't saving into the db (passed in routes/add post request)
const insert_product = db.prepare(/*sql*/ `
  INSERT INTO products (name, unit_price, quantity_per_unit, category_id)
  VALUES(
    $name,
    $quantity_per_unit,
    $category_id,
    $unit_price
  )
  RETURNING id
`);

function createProduct(product) {
  return insert_product.get(product);
}
