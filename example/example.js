import React from 'react';
import { render } from 'react-dom';
import { useLocalStorage } from '../';

const App = () => {
  const [key, set] = React.useState('key1');
  let [name, setName] = useLocalStorage(key, key === 'key1' ? 'default value' : 'default value 2');
  React.useEffect(() => {
    setName('key1 name');
    setTimeout(() => set('key2'), 1000);
  }, []);

  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

render(<App />, document.getElementById('root'));
