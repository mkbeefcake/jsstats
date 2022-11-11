import React from "react";
import { mJoy } from "../../lib/util";

const unit = "tJoy";
const seats = 5;

const Cycles = (props: {}) => {
  const { elections = [], members } = props;

  if (!elections.electionRounds) return <div />;

  const findMember = (key: string) => {
    const member = members.memberships?.find(
      (m) => m.rootAccount === key || m.controllerAccount === key
    );
    if (member) return member.handle;
    //return key.slice(0, 6) + ".." + key.slice(key.length - 6);
    return key;
  };

  return elections.electionRounds
    .sort((a, b) => b.cycleId - a.cycleId)
    .map((e) => (
      <div className="box">
        <h3>Round {e.cycleId}</h3>

        <div className="text-left d-flex flex-column justify-content-between">
          {e.candidates
            .sort((a, b) => b.votePower - a.votePower)
            .map((c, seat: number) => (
              <div key={seat} className="d-flex flex-row mb-2">
                <div className="col-2">
                  <h4 className={seat < seats ? "font-weight-bold" : ""}>
                    {c.member.handle}
                  </h4>
                  <div>
                    {mJoy(c.votePower)} M {unit}
                  </div>
                </div>
                <div className="col-4">
                  {c.noteMetadata?.bulletPoints.map((b, i: number) => (
                    <div key={i}>{b}</div>
                  ))}
                  <div className="">{c.noteMetadata.description}</div>
                </div>
                <div className="col-3 d-flex flex-column ml-2">
                  {e.castVotes
                    .filter(
                      (v) => v.voteFor && v.voteFor.memberId === c.member?.id
                    )
                    .sort((a, b) => b.stake - a.stake)
                    .map((v) => (
                      <div key={v.id} className="m-1 d-flex flex-row">
                        <div className="col-4 text-right">
                          {mJoy(v.stake, 1)} M {unit}
                        </div>
                        <div className="col-8" title={v.castBy}>
                          {findMember(v.castBy)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
        {e.castVotes.filter((v) => !v.voteFor).length ? (
          <div>
            <h4>Not revealed</h4>
            {e.castVotes
              .filter((v) => !v.voteFor)
              .sort((a, b) => b.stake - a.stake)
              .map((v) => (
                <div key={`vote-` + v.id} className="d-flex flex-row">
                  <div className="col-5 text-right">
                    {mJoy(v.stake, 1)} M {unit}
                  </div>
                  <div className="col-7 text-left" title={v.castBy}>
                    {findMember(v.castBy)}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          ""
        )}
      </div>
    ));
};

export default Cycles;
