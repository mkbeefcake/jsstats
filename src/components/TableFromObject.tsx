import React from "react";
import { Table } from "react-bootstrap";

const TableFromObject = (props: {
  data: string | { [key: string]: string };
}) => {
  const { data } = props;
  if (!data) return <span />;
  if (typeof data === "string") return <span>{data}</span>;
  const keys = Object.keys(data);
  return (
    <Table className="text-light">
      <tbody>
        {keys.map((key: string) =>
          typeof data[key] === "object" ? (
            <tr key={key}>
              <td colSpan={2}>
                <TableFromObject data={data[key]} />
              </td>
            </tr>
          ) : (
            <tr key={key}>
              <td className="text-left text-bold">
                <b>{key}</b>
              </td>
              <td className="text-right">{data[key]}</td>
            </tr>
          )
        )}
      </tbody>
    </Table>
  );
};

export default TableFromObject;
