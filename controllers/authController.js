import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken.js';
// import generateToken from '../utils/generateToken.js';


export const register = async (req, res) => {
    try {
        const { name, email, password, role, franchiseId } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'User already exists' });
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash: hash, role, franchiseId });
        const token = generateToken(user._id, user.role);
        // res.status(201).json({ user, 'jhgf' });
        res.status(201).json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
        const token = generateToken(user._id, user.role);
        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};