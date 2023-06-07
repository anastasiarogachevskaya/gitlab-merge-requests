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
  // Add your team members' GitLab User IDs here
  const userIds = [1575, 1231, 202, 291, 1129, 1331, 943, 920];

  for(let userId of userIds) {
    try {
      let response = await axios.get(`${gitlabUrl}/api/v4/merge_requests?state=merged&scope=all&author_id=${userId}`);
      let userResponse = await axios.get(`${gitlabUrl}/api/v4/users/${userId}`);
       // Add user name to each merge request
       for(let mr of response.data) {
        mr.user_name = userResponse.data.name;
        let createdAt = new Date(mr.created_at);
        let closedAt = new Date(mr.merged_at);
        let diffDays = Math.floor((closedAt - createdAt) / (1000 * 60 * 60 * 24));
        let diffHours = Math.floor((closedAt - createdAt) / (1000 * 60 * 60));
        mergeRequests.push({
          id: mr.iid,
          createdAt: mr.created_at,
          closedAt: mr.closed_at,
          title: mr.title,
          user_name: mr.user_name,
          web_url: mr.web_url,
          diffDays,
          diffHours,
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
  // let data = [];
  const mergeRequests = await getMergeRequests();
    
  // for (let mr of mergeRequests) {
  //   let createdAt = new Date(mr.created_at);
  //   let closedAt = new Date(mr.closed_at);
  //   let diffDays = Math.floor((closedAt - createdAt) / (1000 * 60 * 60 * 24));
  //   data.push({
  //     id: mr.iid,
  //     title: mr.title,
  //     user_name: mr.user_name,
  //     web_url: mr.web_url,
  //     diffDays
  //   });
  // }
  res.json(mergeRequests);
});

app.listen(3000, () => {
  console.log('API Server is running on http://localhost:3000');
});
