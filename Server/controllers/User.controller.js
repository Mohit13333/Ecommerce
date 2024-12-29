import { User } from '../model/User.js';

export const fetchUserById = async (req, res) => {
  const { id } = req.user; // Ensure req.user is populated
  console.log(id);
  
  try {
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      name:user.name,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
