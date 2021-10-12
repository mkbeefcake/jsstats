const TOC = (props) => {
  const { section, focus } = props;
  const { kpis, round } = props.round;

  return (
    <div className="mt-4">
      <ul>
        {kpis.sections.map(({ id, name, kpis }) => (
          <li key={id}>
            <div
              onClick={() => focus(`${round}-${id}`)}
              href={`#${round}-${section}`}
            >
              {name}
            </div>
            <ul>
              {kpis.map(({ title }, i: number) => (
                <li key={i} onClick={() => focus(`${round}-${id}-${i + 1}`)}>
                  {round}.{id}-{i + 1} {title}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TOC;
