import React from 'react';

function Input(props: any) {
  return (
    <div className="flex p-7 items-center">
      <label className="flex-auto w-1 block mb-2 text-lg font-bold">
        {props.label}
      </label>
      <div className="flex-auto w-72 basis-7/10 ">
        <input
          type="text"
          name={props.label}
          className="w-full p-4 border rounded-lg dark:border-gray-600"
          onChange={props.onChange}
        />
        {props.isEmpty ? (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500 mt-0">
            <span className="font-medium">Error!</span> Please input value of{' '}
            {props.label}.
          </p>
        ) : (
          <p></p>
        )}
        {/* <p className="mt-2 text-sm text-green-600 dark:text-green-500">
          <span className="font-medium">Well done!</span> Some success message.
        </p>
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">Oh, snapp!</span> Some error message.
        </p> */}
      </div>
      <label className="flex-auto w-1 basis-1/10 font-bold text-lg items-center pl-3">
        {props.token}
      </label>
    </div>
  );
}

export default Input;
