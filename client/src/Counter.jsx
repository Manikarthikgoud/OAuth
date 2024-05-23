import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const Counter = ({ AuthContext }) => {
  const [count, setCount] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/counter', {
          headers: {
            Authorization: `Bearer ${user.name}`,
          },
        });
        setCount(response.data.count);
      } catch (error) {
        console.error('Error fetching counter:', error);
      }
    };

    if (user.token) {
      fetchCounter();
    }
  }, [user.token]);

  const incrementCounter = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/counter/increment',
        {},
        {
          headers: {
            Authorization: `Bearer ${user.name}`,
          },
        }
      );
      setCount(response.data.count);
    } catch (error) {
      console.error('Error incrementing counter:', error);
    }
  };

  const decrementCounter = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/counter/decrement',
        {},
        {
          headers: {
            Authorization: `Bearer ${user.name}`,
          },
        }
      );
      setCount(response.data.count);
    } catch (error) {
      console.error('Error decrementing counter:', error);
    }
  };

  return (
    <div>
      <h2>
        {user.name}
      </h2>
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
    </div>
  );
};

export default Counter;