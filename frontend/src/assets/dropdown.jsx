import React from 'react';

function dropdown() {
  const items = ['Apple', 'Banana', 'Orange'];
  let dropdownItems = [];

  for (let i = 0; i < items.length; i++) {
    listItems.push(<li key={i}>{items[i]}</li>);
  }

  return (
    <div>
      <h2>My Fruit List</h2>
      <ul>{listItems}</ul>
    </div>
  );
}

export default MyComponent;