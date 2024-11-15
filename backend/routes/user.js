const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;
        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 3" });
        }
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email  already exists" });
        }
        if(password.length<=7){
            return res
            .status(400)
            .json({message:"Password's length should be greater than 7"});
        }
        const hashPass= await bcrypt.hash(password,10);
        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address
        });
        await newUser.save();
        return res.status(200).json({ message: "Signup Successfully" });        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims = [
                    { name: existingUser.username}, 
                    {role: existingUser.role },
                ];
                const token = jwt.sign({authClaims}, "Shashank@2024", {
                     expiresIn: "60d",
                     });
                res.status(200).json({ id: existingUser._id, role: existingUser.role, token: token });                
            } else {
                return res.status(400).json({ message: "Invalid credentials" });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
