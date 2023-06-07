import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/merge_requests');
        console.log(response.data);
        // setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Merge Requests</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Author ID</th>
            <th>Days Open</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.authorId}</td>
              <td>{item.daysOpen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
