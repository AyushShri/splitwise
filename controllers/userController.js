const { User } = require('../models');

exports.createUser = async (req, res) => {
    console.log("body is " + req.body);
  const {name} = req.body;
  console.log(" name ", name);
  try {
    let user = await User.findOne({ where: { name } });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = await User.create({name});
    console.log("resp is ", user);
    return res.json(user); 
    
  } catch (err) {
    res.status(500).json({ msg: 'Server error in user controller' });
  }
};

exports.getUserById = async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };  