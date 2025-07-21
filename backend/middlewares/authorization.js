const authorization = (role=[]) => {
  return async (req, res, next) => {
    if(!req.user||!role.includes(req.user.role)){
      return res.status(403).json({message:"Access Denied"})
    }
    next()
    
  };
};

module.exports=authorization