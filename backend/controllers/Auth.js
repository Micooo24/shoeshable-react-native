const bcrypt = require("bcrypt");
const User = require("../models/User");
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const crypto = require('crypto');

exports.Register = async function (req, res) {
    const session = await mongoose.startSession(); // Start a session for transaction
    session.startTransaction();

    try {
        const { 
            username, 
            email, 
            password, 
            firstName, 
            lastName, 
            phoneNumber, 
            address, 
            zipCode, 
            firebaseUid, 
            profileImage 
        } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload the profile image to Cloudinary (if any)
        let uploadedImage = {
            public_id: 'default_public_id',
            url: 'default_url',
        };

        if (profileImage && profileImage.url) {
            try {
                const result = await cloudinary.uploader.upload(profileImage.url, {
                    folder: 'register/users',
                    public_id: profileImage.public_id, // Use the provided public_id
                    overwrite: true,
                });

                uploadedImage = {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error);
                return res.status(500).json({ message: 'Image upload failed', error: error.message });
            }
        }

        // Create a new User instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            address,
            zipCode,
            profileImage: uploadedImage, // Use the uploaded image
            firebaseUid,
            role: "user", // Set role as user
            status: "active", // Set default status as active
        });

        const savedUser = await newUser.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Account has been registered successfully. Please verify your email to activate your account.",
            user: savedUser,
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Checks if Verified user before sending token
exports.Login = async function (req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter email & password' });
        }

        // Find the user by email and include the password field for comparison
        let user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        // Generate JWT token
        const token = user.getJwtToken();

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Return the token and user information
        return res.status(201).json({
            success: true,
            user,
            token,
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};