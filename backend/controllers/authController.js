// import User from "../models/User.js";   
// import PendingUser from "../models/pendingUser.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // SIGNUP
// export const signup = async (req, res) => {
//   try {
//     const { name, email, password, role, phone, cnic, city, cnicFileName, cnicDocumentDataUrl } = req.body;

//     // Check existing user in both collections
//     const existingUser = await User.findOne({ email });
//     const existingPendingUser = await PendingUser.findOne({ email });
    
//     if (existingUser || existingPendingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Store in pending users collection (not main users)
//     const pendingUser = await PendingUser.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       phone: phone || '',
//       cnic: cnic || '',
//       city: city || '',
//       cnicFileName: cnicFileName || '',
//       cnicDocumentDataUrl: cnicDocumentDataUrl || ''
//     });

//     res.status(201).json({
//       message: "Registration submitted successfully. Please wait for admin approval.",
//       pendingApproval: true,
//       user: {
//         id: pendingUser._id,
//         name: pendingUser.name,
//         email: pendingUser.email,
//         role: pendingUser.role,
//         phone: pendingUser.phone,
//         city: pendingUser.city,
//         isApproved: false,
//         isSuspended: false
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // LOGIN
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Check if user is suspended
//     if (user.isSuspended) {
//       return res.status(403).json({ 
//         message: "Account suspended",
//         status: 'suspended',
//         reason: 'suspended'
//       });
//     }

//     // Check if user is approved (skip for admin)
//     if (!user.isApproved && user.role !== 'admin') {
//       return res.status(403).json({ 
//         message: "Account pending admin approval",
//         status: 'pending',
//         reason: 'pending_approval'
//       });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         phone: user.phone,
//         city: user.city,
//         isApproved: user.isApproved,
//         isSuspended: user.isSuspended,
//         profileImageDataUrl: user.profileImageDataUrl
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



import User from "../models/User.js";   
import PendingUser from "../models/pendingUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, phone, cnic, city, cnicFileName, cnicDocumentDataUrl } = req.body;

    // Check existing user in both collections
    const existingUser = await User.findOne({ email });
    const existingPendingUser = await PendingUser.findOne({ email });
    
    if (existingUser || existingPendingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store in pending users collection (not main users)
    const pendingUser = await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || '',
      cnic: cnic || '',
      city: city || '',
      cnicFileName: cnicFileName || '',
      cnicDocumentDataUrl: cnicDocumentDataUrl || ''
    });

    res.status(201).json({
      message: "Registration submitted successfully. Please wait for admin approval.",
      pendingApproval: true,
      user: {
        id: pendingUser._id,
        name: pendingUser.name,
        email: pendingUser.email,
        role: pendingUser.role,
        phone: pendingUser.phone,
        city: pendingUser.city,
        isApproved: false,
        isSuspended: false
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role: selectedRole } = req.body;

    // 🔑 CHECK PENDING USERS FIRST
    const pendingUser = await PendingUser.findOne({ email });
    if (pendingUser) {
      // User exists in pending collection - not approved yet
      return res.status(403).json({ 
        message: "Account pending admin approval",
        status: 'pending',
        reason: 'pending_approval'
      });
    }

    // Check approved users
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 Validate role match if selected role is provided
    if (selectedRole && user.role !== selectedRole) {
      return res.status(400).json({ 
        message: `This account is registered as a ${user.role}. Please select the correct role to login.` 
      });
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({ 
        message: "Account suspended",
        status: 'suspended',
        reason: 'suspended'
      });
    }

    // Check if user is approved (skip for admin)
    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Account pending admin approval",
        status: 'pending',
        reason: 'pending_approval'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        isApproved: user.isApproved,
        isSuspended: user.isSuspended,
        profileImageDataUrl: user.profileImageDataUrl
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' })
    }

    const { name, phone, city, profileImageDataUrl } = req.body

    if (typeof name === 'string') user.name = name
    if (typeof phone === 'string') user.phone = phone
    if (typeof city === 'string') user.city = city
    if (typeof profileImageDataUrl === 'string') user.profileImageDataUrl = profileImageDataUrl

    await user.save()

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      isApproved: user.isApproved,
      isSuspended: user.isSuspended,
      profileImageDataUrl: user.profileImageDataUrl
    })
  } catch (error) {
    console.error('updateProfile error:', error)
    res.status(500).json({ message: error.message })
  }
};