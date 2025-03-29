const bcrypt = require("bcrypt");
const User = require("../models/User");
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const crypto = require('crypto');
// const admin = require("../firebase_backend/firebaseAdmin"); // Import Firebase Admin
const { OAuth2Client } = require('google-auth-library'); // Import Google Auth Library
const client = new OAuth2Client('80143970667-pujqfk20vgm63kg1ealg4ao347i1iked.apps.googleusercontent.com'); // Replace with your webClientId




//Register a new user
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
                    folder: 'users',
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


//Login with email and  password comparison to the backend
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


//Google Login with Firebase UID and created credentials through database 
exports.googleLogin = async function (req, res) {
    try {
        const { idToken, firebaseUid } = req.body; // Receive firebaseUid from the frontend
        console.log("Received Firebase UID:", firebaseUid);

        // Verify the ID token using Google Auth Library
        const ticket = await client.verifyIdToken({
            idToken,
            audience: '80143970667-pujqfk20vgm63kg1ealg4ao347i1iked.apps.googleusercontent.com', // Replace with your webClientId
        });

        const payload = ticket.getPayload();
        const { email, name, picture: photoURL } = payload;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (!user) {
            console.log("User not found, creating a new user");

            // Create a new User instance with default values
            user = new User({
                username: email.split("@")[0], // Use email prefix as username
                email,
                firebaseUid, // Save the Firebase UID in the database
                firstName: name.split(" ")[0],
                lastName: name.split(" ").slice(1).join(" "),
                phoneNumber: "00000000000", // Default phone number
                address: "Default Address", // Default address
                zipCode: "0000", // Default zip code
                profileImage: {
                    public_id: "register/users/google-login-profile",
                    url: photoURL || "https://default-profile-image-url.com/default-profile.png", // Use a default image if none provided
                },
            });

            await user.save();
            console.log("New user created and saved:", user);
        } else {
            console.log("User found:", user);

            // Ensure default values are set for existing users if fields are missing
            user.phoneNumber = user.phoneNumber || "00000000000";
            user.address = user.address || "Default Address";
            user.zipCode = user.zipCode || "0000";

            // Save any updates to the user
            await user.save();
        }

        // Generate JWT token
        const token = user.getJwtToken();
        console.log("Generated JWT token:", token);

        // Return the token and user information
        return res.status(200).json({
            token,
            userId: user._id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber, // Include phoneNumber
            address: user.address, // Include address
            zipCode: user.zipCode, // Include zipCode
            profileImage: user.profileImage, // Include profileImage
            firebaseUid: user.firebaseUid, // Include Firebase UID in the response
        });
    } catch (error) {
        console.error("Error during Google login:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Get User Profile via middleware
exports.getUserProfile = async function (req, res, next) {
    try {
        // Fetch user by ID
        const user = await User.findById(req.user.id);

        // Check if both user and customer exist
        if (!user ) {
            return res.status(404).json({
                success: false,
                message: "User or customer details not found"
            });
        }
        // Return user and customer details in the response
        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                zipCode: user.zipCode,
                profileImage: user.profileImage

            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user profile" });
    }
}

//Update User Profile via middleware
exports.updateProfile = async function (req, res, next) {
    try {
        const { firstName, lastName, phoneNumber, address, zipCode } = req.body;

        // Initialize a new user data object
        const newUserData = {
            firstName,
            lastName,
            phoneNumber,
            address,
            zipCode,
        };

        // Start transaction session
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update profile image if provided
            if (req.file) {
                console.log("Uploaded file buffer:", req.file.buffer); // Debugging log
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'users', width: 150, crop: "scale" },
                        (error, result) => {
                            if (error) {
                                reject(new Error("Cloudinary upload failed"));
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(req.file.buffer);
                });

                console.log("Cloudinary upload result:", result); // Debugging log
                newUserData.profileImage = {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
            } else {
                console.log("No file uploaded, skipping profile image update");
            }

            // Update the user details
            const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
                new: true,
                runValidators: true,
                session,
            });

            if (!updatedUser) {
                throw new Error("User not found");
            }

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            // Respond with updated user details
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            // Abort the transaction in case of an error
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};