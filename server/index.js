require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();

const gitlabApiToken = process.env.GITLAB_API_TOKEN;
const gitlabUrl = process.env.GITLAB_URL;

axios.defaults.headers.common['PRIVATE-TOKEN'] = gitlabApiToken;

const getMergeRequests = async (authorId) => {
  try {
    const response = await axios.get(`${gitlabUrl}/api/v4/merge_requests?state=closed&scope=all&author_id=${authorId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
app.use(cors());

app.get('/api/merge_requests', async (req, res) => {
  const teamMembers = [1575, 1231, 202, 291, 1129, 1331, 943, 920]; // replace with IDs of your team members
  let data = [];

  for (let member of teamMembers) {
    const mergeRequests = await getMergeRequests(member);
    
    for (let mr of mergeRequests) {
      let createdAt = new Date(mr.created_at);
      let closedAt = new Date(mr.closed_at);
      let diffDays = Math.floor((closedAt - createdAt) / (1000 * 60 * 60 * 24));
      data.push({id: mr.id, authorId: member, daysOpen: diffDays});
    }
  }

  res.json(data);
});

app.listen(3000, () => {
  console.log('API Server is running on http://localhost:3000');
});
