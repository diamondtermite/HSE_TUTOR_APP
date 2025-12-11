// importing necessary libraries and hooks
import { useState, useEffect, useId } from "react";

function Search(id, btnId) { // Search component taking id and btnId as props, bare bones placeholder
    const [tutorName, setTutorName] = useState(""); // state to hold tutor name input

    /* 
    Rendering the Search component with an input field and a button.
    The input field has a placeholder "Search..." and uses the provided id prop.
    The button uses the provided btnId prop and updates the tutorName state on click.
    */
    return (

        <div className="search-bar-div">

            <input 
                type="text" 
                id={id} 
                placeholder="Search..." 
            />
            
            <button id={btnId} onClick={(e) => setTutorName(e.target.value)}>Go</button>

        </div>

    );

}

export default Search;