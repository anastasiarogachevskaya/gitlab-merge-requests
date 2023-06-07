require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();

const gitlabApiToken = process.env.GITLAB_API_TOKEN;
const gitlabUrl = process.env.GITLAB_URL;

axios.defaults.headers.common['PRIVATE-TOKEN'] = gitlabApiToken;

const getMergeRequests = async () => {
  let mergeRequests = [];
  const userIds = [1575, 1231, 202, 291, 1129, 1331, 943, 920];
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const createdAfter = twoWeeksAgo.toISOString().slice(0, 19) + 'Z'; // format date

  for(let userId of userIds) {
    try {
      let response = await axios.get(`${gitlabUrl}/api/v4/merge_requests?state=merged&scope=all&author_id=${userId}&created_after=${createdAfter}`);
      let userResponse = await axios.get(`${gitlabUrl}/api/v4/users/${userId}`);
      
      for(let mr of response.data) {
        let createdAt = new Date(mr.created_at);
        let mergedAt = new Date(mr.merged_at);
        let diffDays = Math.floor((mergedAt - createdAt) / (1000 * 60 * 60 * 24));
        let diffHours = Math.floor((mergedAt - createdAt) / (1000 * 60 * 60));
        
        mergeRequests.push({
          id: mr.iid,
          title: mr.title,
          user_name: userResponse.data.name,
          web_url: mr.web_url,
          diffDays,
          diffHours
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  return mergeRequests;
};

app.use(cors());

app.get('/api/merge_requests', async (req, res) => {
  const mergeRequests = await getMergeRequests();
  res.json(mergeRequests);
});

app.listen(3000, () => {
  console.log('API Server is running on http://localhost:3000');
});
