// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');

// //routes
// router.post('/', createProduct);
// router.get('/all', listProducts);
// router.get('/:id', getProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', _deleteProduct);

// module.exports = router;

// function createProduct(req, res, next) {
//   productController
//     .create(req.body)
//     .then((product) => {
//       res.status(201).json(product);
//     })
//     .catch((err) => {
//       next(err);
//     });
// }

// function listProducts(req, res, next) {
//   productController
//     .getAll()
//     .then((products) => {
//       res.json(products);
//     })
//     .catch((err) => {
//       next(err);
//     });
// }

// function getProduct(req, res, next) {
//   productController
//     .getById(req.params.id)
//     .then((product) => (product ? res.json(product) : res.sendStatus(404)))
//     .catch((err) => next(err));
// }

// function updateProduct(req, res, next) {
//   productController
//     .update(req.params.id, req.body)
//     .then(() => res.json({}))
//     .catch((err) => next(err));
// }

// function _deleteProduct(req, res, next) {
//   productController
//     .delete(req.params.id)
//     .then(() => res.json({}))
//     .catch((err) => next(err));
// }
