// userRoute.js

// Import required modules
import express from 'express';
const router = express.Router();

// Import the User model and any other necessary modules

// Other user routes here...

// Logout route
router.get('/', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/login');
    }
  });
});

// Export the router
export default router;
