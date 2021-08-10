import React from "react";
import { Link } from "@material-ui/core";
import { X, Info } from "react-feather";
import { domain } from "../../config";

const donationUrl = `${domain}/#/members/joystreamstats`;
const ideasUrl = `${domain}/#/forum/threads/257`;

const Footer = (props: {
  show: boolean;
  toggleHide: () => void;
  link: string;
}) => {
  const { show, link } = props;
  if (!show)
    return (
      <Info className="footer-hidden" onClick={() => props.toggleHide()} />
    );
  return (
    <div className="footer">
      <X className="footer-hidden" onClick={() => props.toggleHide()} />
      If you find this place useful, please consider to{" "}
      <Link className="mx-1" href={donationUrl}>
        <u>donate some tokens</u>
      </Link>
      or a
      <Link className="mx-1" href={ideasUrl}>
        <u>message with ideas</u>
      </Link>{" "}
      to make it even better.
    </div>
  );
};

export default Footer;
