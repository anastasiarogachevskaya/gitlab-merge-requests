import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [avgHours, setAvgHours] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3000/api/merge_requests')
      .then(response => {
        setData(response.data);
        const totalHours = response.data.reduce((total, mr) => total + mr.diffHours, 0);
        const averageHours = totalHours / response.data.length;
        setAvgHours(averageHours);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
/*
{
    "id": 11258,
    "createdAt": "2023-06-06T08:49:42.447Z",
    "closedAt": null,
    "title": "RPC-53827: settle-node logic moved to reducer",
    "user_name": "alireza sheikholmolouki",
    "web_url": "https://gitlab.relexsolutions.com/DevHEL/planning-cloud/-/merge_requests/11258",
    "diffDays": 0,
    "diffHours": 4
  },
*/
return (
    <div className="App">
      <h1>Merge Requests</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Hours Open</th>
            <th>Days Open</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td><a href={item.web_url} target="_blank" rel="noreferrer">{item.title}</a></td>
              <td>{item.user_name}</td>
              <td>{item.diffHours}</td>
              <td>{item.diffDays}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Average Hours per MR: {avgHours}</h3>
    </div>
  );
}

export default App;
