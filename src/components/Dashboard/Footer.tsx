import React from "react";
import { X, Info } from "react-feather";

const Footer = (props: {
  connecting: boolean;
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
    <div className="w-100 footer">
      <X className="footer-hidden" onClick={() => props.toggleHide()} />
      If you find this place useful,{" "}
      <a className="mx-1" href={link}>
        <u>send some tokens</u>
      </a>
      and a
      <a className="mx-1" href="/forum/threads/257">
        <u>message with ideas</u>
      </a>{" "}
      to make it even better.
    </div>
  );
};

export default Footer;
