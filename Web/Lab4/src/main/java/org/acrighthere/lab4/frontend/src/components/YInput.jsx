export default function YInput({ value, onChange, error }) {
    return (
        <div>
            <label>Y:</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="-3 ... 5"
            />
            {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    );
}
