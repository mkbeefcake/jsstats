import React from "react";
//import { Link } from "react-router-dom";
import { Handles, Member, Post, ProposalDetail } from "../../types";
import MemberBox from "./MemberBox";
import Loading from "../Loading";
import Back from "../Back";

interface IProps {
  councils: number[][];
  members: Member[];
  handles: Handles;
  proposals: ProposalDetail[];
  posts: Post[];
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
    let uniqueMembers: Member[] = [];
    members.forEach(
      (m) =>
        uniqueMembers.find((member) => member.id === m.id) ||
        uniqueMembers.push(m)
    );
    uniqueMembers = uniqueMembers.sort((a, b) => Number(a.id) - Number(b.id));

    if (!uniqueMembers.length) return <Loading />;

    const third = members.length / 3;
    const row1 = uniqueMembers.slice(0, third + 1);
    const row2 = uniqueMembers.slice(third + 1, 2 * third + 1);
    const row3 = uniqueMembers.slice(2 * third + 1, members.length);

    return (
      <div>
        <Back />
        <h1 className="text-center text-white">Joystream Members</h1>
        <div className="d-flex flew-row justify-content-around">
          <div className="col-4 d-flex flex-column">
            {row1.map((m) => (
              <MemberBox
                key={String(m.account)}
                id={Number(m.id)}
                account={String(m.account)}
                handle={m.handle || handles[String(m.account)]}
                members={members}
                councils={councils}
                proposals={proposals}
                posts={posts}
              />
            ))}
          </div>
          <div className="col-4 d-flex flex-column">
            {row2.map((m) => (
              <MemberBox
                key={String(m.account)}
                id={Number(m.id)}
                account={String(m.account)}
                handle={m.handle || handles[String(m.account)]}
                members={members}
                councils={councils}
                proposals={proposals}
                posts={posts}
              />
            ))}
          </div>
          <div className="col-4 d-flex flex-column">
            {row3.map((m) => (
              <MemberBox
                key={String(m.account)}
                id={Number(m.id)}
                account={String(m.account)}
                handle={m.handle || handles[String(m.account)]}
                members={members}
                councils={councils}
                proposals={proposals}
                posts={posts}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Members;
