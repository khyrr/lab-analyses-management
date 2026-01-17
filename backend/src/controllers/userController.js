const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

// Get all doctors (MEDECIN role only)
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: 'MEDECIN' },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if username is already taken by another user
    if (username && username !== existingUser.username) {
      const userWithUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (userWithUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Validate role if provided
    if (role && !['ADMIN', 'TECHNICIAN', 'SECRETARY', 'MEDECIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(username && { username }),
        ...(role && { role }),
      },
      select: {
        id: true,
        username: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting yourself
    if (req.user.userId === parseInt(id)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Change user password
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password_hash },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

module.exports = {
  getAllDoctors,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
};
