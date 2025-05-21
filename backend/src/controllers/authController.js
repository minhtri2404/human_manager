const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async(req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({success: false, error: "Người dùng không tồn tại"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
           return res.status(404).json({success: false, error: "Sai mật khẩu"});
        }

        const token = jwt.sign({id: user.id, role:user.role},
            process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION}
        );
        res.status(200).json({success: true, token, user: {id: user.id, name: user.name, role: user.role}});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});

    }
    
} 

const verify = async(req, res) => {
    return res.status(200).json({ success: true, user: req.user})
}

module.exports = { 
    login, verify 
};
