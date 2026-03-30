
import React from "react";

const ResultCard = ({ result }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-4 w-full">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {result.name}
      </h3>
      <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
        <div>
          <p className="font-semibold">Offense:</p>
          <p>{result.offense}</p>
        </div>
        <div>
          <p className="font-semibold">Court:</p>
          <p>{result.court}</p>
        </div>
        <div>
          <p className="font-semibold">Sentence:</p>
          <p>{result.sentence}</p>
        </div>
        <div>
          <p className="font-semibold">Fine/Restitution:</p>
          <p>{result.fine_or_restitution}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
