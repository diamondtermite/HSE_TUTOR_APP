import { useState, useEffect, useId } from "react";

function Search(id, btnId) {
    const [shown, setShown]=useState(true);
    const [tutorName, setTutorName] = useState("");
    
    if (!shown) {
            return null;
    }
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