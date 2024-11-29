const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: "./uploads/", 
    filename: (_, file, cb) => { 
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Route to upload avatar
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
    try {
        const { id } = req.headers; 
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        await User.findByIdAndUpdate(id, { avatar: avatarUrl });

        res.status(200).json({ success: true, avatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

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
        if (password.length <= 7) {
            return res.status(400).json({ message: "Password's length should be greater than 7" });
        }
        const hashPass = await bcrypt.hash(password, 10);
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
        
        bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const token = jwt.sign(
                    {
                        id: existingUser._id,
                        username: existingUser.username,
                        role: existingUser.role
                    },
                    "Shashank@2024",
                    { expiresIn: "60d" }
                );
                res.status(200).json({ id: existingUser._id, role: existingUser.role, token: token });
            } else {
                return res.status(400).json({ message: "Invalid credentials" });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get-user-information", async (req, res) => {
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

// Route to update username
router.put("/update-username", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { username } = req.body;
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }
        await User.findByIdAndUpdate(id, { username: username });
        return res.status(200).json({ message: "Username updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Route to update email
router.put("/update-email", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { email } = req.body;
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        await User.findByIdAndUpdate(id, { email: email });
        return res.status(200).json({ message: "Email updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Route to update password
// Route to update password
router.put("/update-password", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { currentPassword, newPassword } = req.body;

        // Validate inputs
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new passwords are required" });
        }
        if (newPassword.length <= 7) {
            return res.status(400).json({ message: "New password must be at least 8 characters long" });
        }

        const user = await User.findById(id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash and save the new password
        const hashPass = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(id, { password: hashPass });

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
