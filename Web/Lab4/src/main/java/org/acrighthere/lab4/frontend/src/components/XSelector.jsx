export default function XSelector({ value, onChange }) {
    const values = [-3, -2, -1, 0, 1, 2, 3, 4, 5];

    return (
        <div>
            <label>X:</label>
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
