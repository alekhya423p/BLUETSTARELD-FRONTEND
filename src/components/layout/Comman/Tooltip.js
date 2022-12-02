import "./style.css";
export const Tooltip = ({
  children,
  tooltips,
  color = "#fff",
  bgColor = "#000",
  border = "#008b8b",
}) => {
  return (
    <>
      <div className="Tooltip">
        <span className="text"> {children} </span>{" "}
        <p style={{
            backgroundColor: bgColor,
            color: color,
            borderColor: border,
          }}
          className="title"
        >
          {tooltips
            ? tooltips.map((el, i) => (
                <span className="title-item" key={i}>
                  {tooltips.length > 1 && <span> {i + 1 + ". "} </span>}{" "}
                  {el["value"]}{" "}
                </span>
              ))
            : children}{" "}
        </p>{" "}
      </div>{" "}
    </>
  );
};
