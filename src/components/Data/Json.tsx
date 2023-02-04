import Json from "react-json-view";

const Tree = (props: {}) => {
  const { src, name = false, collapsed = 1, theme, style } = props;
  const combinedStyle = { padding: "10px", zIndex: "10", ...style };
  return (
    <Json
      src={src}
      collapsed={collapsed}
      theme={theme || "railscasts"}
      name={name}
      style={combinedStyle}
    />
  );
};

export default Tree;
