import { useState, useEffect, useId, use } from "react";
const [shown, setShown]=useState(true);
const [tutorName, setTutorName] = useState("");
function Search(id, btnId) {

    
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