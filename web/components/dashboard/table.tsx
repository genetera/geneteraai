import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "../ui/buttons/button";
import ButtonSecondary from "../ui/buttons/button-secondary";

export default function TableData() {
  return (
    <>
      <div className="relative overflow-x-auto border rounded-md mt-3 mb-3">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Project
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Color</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Category</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Price</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-blue-900 whitespace-nowrap dark:text-white"
              >
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">
                <div className="flex justify-start items-center cursor-pointer">
                  <div className="bg-black p-2 rounded flex justify-center items-center font-bold text-white w-5 h-5">
                    G
                  </div>
                  <span className="ml-2 text-blue-900">Genetera</span>
                </div>
              </td>
              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">Laptop</td>
              <td className="px-6 py-4">$2999</td>
              <td className="px-6 py-4 text-right">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-1"
                >
                  <ButtonSecondary
                    icon={PencilSquareIcon}
                    size="xs"
                  ></ButtonSecondary>
                </a>
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  <ButtonPrimary
                    icon={TrashIcon}
                    color="rose"
                    size="xs"
                  ></ButtonPrimary>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
