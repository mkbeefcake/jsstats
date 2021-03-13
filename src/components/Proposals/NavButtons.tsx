import React from "react";
import { Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-feather";

const NavButtons = (props: {
  setPage: (page: number) => void;
  page: number;
  limit: number;
  proposals: number;
}) => {
  const { setPage, limit, page, proposals } = props;
  if (proposals < limit) return <div/>
  return (
    <div className="text-center">
      <Button
        variant="secondary"
        className="btn btn-sm"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="secondary"
        className="btn btn-sm ml-1"
        disabled={page * limit > proposals}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
export default NavButtons;
