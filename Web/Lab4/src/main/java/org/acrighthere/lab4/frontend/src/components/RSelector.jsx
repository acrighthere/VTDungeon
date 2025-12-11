export default function RSelector({ value, onChange }) {
    const values = [1, 2, 3, 4, 5];

    return (
        <div>
            <label>R:</label>
            {values.map(v => (
                <label key={v} style={{ marginRight: "8px" }}>
                    <input
                        type="checkbox"
                        checked={value === v}
                        onChange={() => onChange(v)}
                    />
                    {v}
                </label>
            ))}
        </div>
    );
}
