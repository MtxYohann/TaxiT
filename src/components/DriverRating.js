import { useEffect, useState } from "react";

export default function DriverRating({ driverId }) {
    const [average, setAverage] = useState(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchRating() {
            const res = await fetch(`http://loadbalancer-backend-taxit-1400536818.eu-west-3.elb.amazonaws.com:4000/api/reviews/driver/${driverId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                mode: 'cors'
            });
            const data = await res.json();
            setAverage(data.average);
            setCount(data.count);
        }
        fetchRating();
    }, [driverId]);

    if (average === null) return <span>Note : ...</span>;

    return (
        <span>
            Note moyenne&nbsp;
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    style={{
                        fontSize: "1.3rem",
                        filter: n <= Math.round(average) ? "none" : "grayscale(80%)"
                    }}
                >🚗</span>
            ))}
            {` (${average !== null && average !== undefined ? average.toFixed(1) : "0.0"} / 5, ${count} avis)`}
        </span>
    );
}