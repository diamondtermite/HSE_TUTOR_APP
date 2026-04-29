function DateRangePicker({ fromDate, toDate, onFromChange, onToChange }) {
    return (
        <div className="dateRangeContainer">
            <label className="filterLabel">Date Range</label>
            <div className="dateInputs">
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => onFromChange(e.target.value)}
                    className="dateInput"
                />
                <span>to</span>
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => onToChange(e.target.value)}
                    className="dateInput"
                />
            </div>
        </div>
    );
}

export default DateRangePicker;