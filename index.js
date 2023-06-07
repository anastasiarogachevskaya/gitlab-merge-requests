require('dotenv').config();
const axios = require('axios');

const gitlabApiToken = process.env.GITLAB_API_TOKEN;
const gitlabUrl = process.env.GITLAB_URL;

axios.defaults.headers.common['PRIVATE-TOKEN'] = gitlabApiToken;

const getMergeRequests = async (authorId) => {
  try {
    const response = await axios.get(`${gitlabUrl}/api/v4/merge_requests?state=closed&scope=all&author_id=${authorId}`);
    const mergeRequests = response.data;

    for (let mr of mergeRequests) {
      let createdAt = new Date(mr.created_at);
      let closedAt = new Date(mr.closed_at);
      let diffDays = Math.floor((closedAt - createdAt) / (1000 * 60 * 60 * 24));
      console.log(`Merge request ${mr.id} by user ${authorId} was opened for ${diffDays} day(s).`);
    }
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  const teamMembers = [1575, 1231, 202, 291, 1129, 1331, 943, 920]; // replace with IDs of your team members

  for (let member of teamMembers) {
    console.log(`Fetching MRs for author ${member}`);
    await getMergeRequests(member);
  }
};

main().catch(error => console.error('Failed to get merge requests:', error));
