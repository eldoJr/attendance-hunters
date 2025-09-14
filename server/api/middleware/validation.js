const { validationResult } = require('express-validator');
const { error } = require('../utils/response');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json(error(
      'Validation failed',
      400,
      errors.array()
    ));
  }
  
  next();
};

module.exports = { handleValidation };