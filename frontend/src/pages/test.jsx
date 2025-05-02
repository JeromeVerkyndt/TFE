
function Test() {
    const buttons = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="container mt-5 text-center">
            <h1 className="mb-4">Mes 30 Boutons</h1>
            <div className="row row-cols-5 g-3">
                {buttons.map((num) => (
                    <div className="col" key={num}>
                        <button className="btn btn-primary w-100">Bouton {num}</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Test;
