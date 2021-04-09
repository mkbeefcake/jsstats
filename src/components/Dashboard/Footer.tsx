import React from "react";
import { X, Info } from "react-feather";

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
    <div className="w-100 footer text-light">
      <X className="footer-hidden" onClick={() => props.toggleHide()} />
      If you find this place useful, please consider to{" "}
      <a className="mx-1 text-light" href={link}>
        <u>send some tokens</u>
      </a>
      or a
      <a className="mx-1 text-light" href="/forum/threads/257">
        <u>message with ideas</u>
      </a>{" "}
      to make it even better.
    </div>
  );
};

export default Footer;
