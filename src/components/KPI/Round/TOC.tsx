const TOC = (props) => {
  const { focus } = props;
  const { kpis, round } = props.round;

  return (
    <div className="my-2">
      <ul>
        <li>
          KPI {round}
          <ul>
            {kpis.sections.map(({ name, kpis }, section: number) => (
              <li>
                <div
                  onClick={() => focus(`#${round}-${section + 1}`)}
                  href={`#${round}-${section + 1}`}
                >
                  {name}
                </div>
                <ul>
                  {kpis.map(({ title }, kpi: number) => (
                    <li
                      onClick={() =>
                        focus(`#${round}-${section + 1}-${kpi + 1}`)
                      }
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default TOC;
