import "./Slider.css";

const Slider = ({ title, id = "", min, max, step = 1, _ref = null }) => {
    const tickMarks = [];
    let tick = min;
    while (tick <= max) {
        tickMarks.push(<span key={tick}>{tick}</span>);
        tick += step;
    }
    return (
        <>
            <div className="slider-title text-start">{title}</div>
            <input type="range" className="form-range slider" id={id} min={min} max={max} step={step} ref={_ref}></input>
            <div className="slider-tickmarks">
                {tickMarks}
            </div>
        </>
    );
}

export default Slider;