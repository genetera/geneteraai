import React from "react";

interface IProps {
  children?: any;
  headers: string[];
}

const Table = (props: IProps) => {
  return (
    <>
      <div className="relative overflow-x-auto border rounded-md mt-3 mb-3">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs p-6 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {props.headers.map((header, indx) => (
                <th scope="col" key={indx} className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{props.children}</tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
