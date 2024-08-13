const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const user="joseph"
const pass="BDRbxX16I8ccCQ0o"

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.ho05f.mongodb.net/Server`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const voteSchema = new mongoose.Schema({
    email: String,
    vote: String
});
const Vote = mongoose.model('Vote', voteSchema);

app.post('/submit', async (req, res) => {
    const { email, vote } = req.body;

    // Check if the email is already registered
    const existingVote = await Vote.findOne({ email });
    if (existingVote) {
        // If email exists, update vote
        await Vote.updateOne({ email }, { vote });
    } else {
        // Otherwise, create a new vote
        const newVote = new Vote({ email, vote });
        await newVote.save();
    }

    // Get vote counts
    const voteACount = await Vote.countDocuments({ vote: 'A' });
    const voteBCount = await Vote.countDocuments({ vote: 'B' });

    res.send(`
        <h1>Vote Results</h1>
        <p>Votes for Option A: ${voteACount}</p>
        <p>Votes for Option B: ${voteBCount}</p>
        <a href="/">Go back</a>
    `);
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Vote.html');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
