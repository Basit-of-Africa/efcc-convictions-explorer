
import React from "react";

const ResultCard = ({ result }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-4 w-full">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {result.name}
      </h3>
      <div className="grid grid-cols-2 gap-4 text-gray-600">
        <div>
          <p className="font-semibold text-gray-700">Offense:</p>
          <p>{result.offense}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Court:</p>
          <p>{result.court}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Sentence:</p>
          <p>{result.sentence}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Fine/Restitution:</p>
          <p>{result.fine_or_restitution}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
