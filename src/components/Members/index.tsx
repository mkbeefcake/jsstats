import React from "react";
import { Member, Post, ProposalDetail, Seat } from "../../types";
import MemberBox from "./MemberBox";
import Loading from "../Loading";

interface IProps {
  councils: Seat[][];
  members: Member[];
  proposals: ProposalDetail[];
  posts: Post[];
  validators: string[];
  history:any
  status:{startTime:number}
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
    const { getMember,councils,  members, posts, proposals, status } = this.props;
    let unique: Member[] = [];
    members.forEach(
      (m) => unique.find((member) => member.id === m.id) || unique.push(m)
    );
    unique = unique.sort((a, b) => +a.id - +b.id);
    if (!unique.length) return <Loading />;

    const quart = Math.floor(unique.length / 4) + 1;
    const cols = [
      members.slice(0, quart),
      members.slice(quart, 2 * quart),
      members.slice(2 * quart, 3 * quart),
      members.slice(3 * quart),
    ];

    return (
      <div>
        <h1 className="text-center text-white">Joystream Members</h1>
        <div className="d-flex flew-row justify-content-between">
          {cols.map((col, index: number) => (
            <div key={`col-${index}`} className="d-flex flex-column col-3 p-0">
              {col.map((m) => (
                <div key={`member-${m.id}`} className="box">
                  <MemberBox
                    id={Number(m.id)}
                    account={m.rootKey}
                    members={members}
		    member={getMember(m.handle)}
                    councils={councils}
                    proposals={proposals}
                    placement={index === 3 ? "left" : "bottom"}
                    posts={posts}
                    startTime={status.startTime}
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
