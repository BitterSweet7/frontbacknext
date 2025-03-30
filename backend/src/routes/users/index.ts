import express from 'express';
import { User } from '../../models/user.model';

const router = express.Router();

// Test endpoint to create a single user
router.post('/test', async (req, res) => {
    try {
        const { firstName, lastName, username, email } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !username || !email) {
            return res.status(400).json({ 
                message: 'Missing required fields. Please provide firstName, lastName, username, and email.' 
            });
        }

        const testUser = await User.create({
            firstName,
            lastName,
            username,
            email
        });
        
        res.status(201).json({
            message: 'User created successfully',
            user: testUser
        });
    } catch (error) {
        console.error('Error creating test user:', error);
        // Send more detailed error message
        res.status(500).json({ 
            message: 'Error creating test user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get paginated users
router.get('/paginated', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const skip = page - 1; // Skip previous pages

        // Get total count first
        const totalUsers = await User.countDocuments();
        
        // Get the user for the current page
        const user = await User.findOne().skip(skip);

        if (!user) {
            return res.status(404).json({ message: 'No more users found' });
        }

        res.json({
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email
            },
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalUsers),
                totalUsers
            }
        });
    } catch (error) {
        console.error('Error fetching paginated users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 