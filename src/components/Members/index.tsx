import React from "react";
import { Handles, Member, Post, ProposalDetail, Seat } from "../../types";
import MemberBox from "./MemberBox";
import Loading from "../Loading";
import Back from "../Back";

interface IProps {
  councils: Seat[][];
  members: Member[];
  handles: Handles;
  proposals: ProposalDetail[];
  posts: Post[];
  now: number;
  block: number;
  validators: string[];
}

interface IState {
  memberId: number;
}

class Members extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { memberId: 0 };
  }

  selectMember(memberId: number) {
    this.setState({ memberId });
  }

  render() {
    const { councils, handles, members, posts, proposals } = this.props;
    let unique: Member[] = [];
    members.forEach(
      (m) => unique.find((member) => member.id === m.id) || unique.push(m)
    );
    unique = unique.sort((a, b) => +a.id - +b.id);
    if (!unique.length) return <Loading />;

    const startTime = this.props.now - this.props.block * 6000;
    const quart = Math.floor(unique.length / 4) + 1;
    const cols = [
      unique.slice(0, quart),
      unique.slice(quart, 2 * quart),
      unique.slice(2 * quart, 3 * quart),
      unique.slice(3 * quart),
    ];

    return (
      <div>
        <Back />
        <h1 className="text-center text-white">Joystream Members</h1>
        <div className="d-flex flew-row justify-content-between">
          {cols.map((col, index: number) => (
            <div key={`col-${index}`} className="d-flex flex-column col-3 p-0">
              {col.map((m) => (
                <div key={String(m.account)} className="box">
                  <MemberBox
                    id={Number(m.id)}
                    account={String(m.account)}
                    handle={m.handle || handles[String(m.account)]}
                    members={members}
                    councils={councils}
                    proposals={proposals}
                    placement={index === 3 ? "left" : "bottom"}
                    posts={posts}
                    startTime={startTime}
                    validators={this.props.validators}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Members;
