const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  req.body = result.data; // Ensures only validated data passes through
  next();
};

module.exports = validate;
