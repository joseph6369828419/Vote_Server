const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create the Express app
const app = express();
app.use(express.json());
app.use(cors());

const user="joseph"
const pass="BDRbxX16I8ccCQ0o"
// Connect to MongoDB
mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.ho05f.mongodb.net/Vote`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the vote schema and model
const voteSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    votesA: { type: Number, default: 0 },
    votesB: { type: Number, default: 0 },
});

const Vote = mongoose.model('Vote', voteSchema);






app.get("/", function (req, res) {
    res.sendFile(__dirname + "/Vote.html");
  });









// API route to submit a vote
app.post('/submit-vote', async (req, res) => {
    const { email, voteFor } = req.body;

    try {
        const existingVote = await Vote.findOne({ email });

        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted.' });
        }

        const newVote = new Vote({
            email,
            votesA: voteFor === 'A' ? 1 : 0,
            votesB: voteFor === 'B' ? 1 : 0,
        });

        await newVote.save();
        res.status(200).json({ message: 'Vote submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting vote.' });
    }
});

// API route to get current votes
app.get('/get-votes', async (req, res) => {
    try {
        const votesA = await Vote.countDocuments({ votesA: { $gt: 0 } });
        const votesB = await Vote.countDocuments({ votesB: { $gt: 0 } });
        res.status(200).json({ votesA, votesB });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving votes.' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
