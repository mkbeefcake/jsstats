import React from "react";

const About = (props: { about: string }) => {
  const { about } = props;
  const maxWidth = "320px"; // TODO OPTIMIZE

  if (about === ``) return <div />;

  return (
    <div className="mt-3" style={{ maxWidth }}>
      {about}
    </div>
  );
};

export default About;
