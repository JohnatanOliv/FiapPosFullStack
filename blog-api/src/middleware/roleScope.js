const withRoleScope = (role) => (req, res, next) => {
  req.roleScope = role;
  return next();
};

module.exports = { withRoleScope };
