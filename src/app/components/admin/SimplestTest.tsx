import React, { useState } from 'react';

/**
 * THE ABSOLUTE SIMPLEST POSSIBLE TEST
 * Just a button that adds a number to a list
 * No forms, no images, no complexity
 */
export function SimplestTest() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    console.log('🎯 BUTTON WAS CLICKED!');
    const newNumber = numbers.length + 1;
    setNumbers([...numbers, newNumber]);
    setClickCount(clickCount + 1);
    alert(`Success! You clicked the button ${clickCount + 1} time(s)`);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-4 border-green-500 max-w-2xl mx-auto my-8">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-4 text-green-900">
        ✅ SUPER SIMPLE TEST
      </h2>
      
      <p className="text-lg mb-6 text-green-800">
        This is the simplest possible test. Just click the button below.
      </p>

      {/* The Button */}
      <button
        onClick={handleClick}
        className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-6 px-8 rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95 mb-6"
      >
        🚀 CLICK ME (Clicked {clickCount} times)
      </button>

      {/* Results */}
      <div className="bg-white rounded-lg p-6 border-2 border-green-300">
        <h3 className="font-bold text-lg mb-3 text-green-900">What Should Happen:</h3>
        <ol className="list-decimal list-inside space-y-2 text-green-800 mb-4">
          <li>You see an alert popup ✅</li>
          <li>The button text updates ✅</li>
          <li>A number appears below ✅</li>
          <li>The console shows a message ✅</li>
        </ol>

        <h3 className="font-bold text-lg mb-3 text-green-900">Numbers Added:</h3>
        {numbers.length === 0 ? (
          <p className="text-gray-500 italic">No clicks yet. Click the button above!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {numbers.map((num, index) => (
              <div
                key={index}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-full text-lg"
              >
                {num}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mt-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
        <p className="font-bold text-yellow-900 mb-2">Current Status:</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Total Clicks:</span> {clickCount}
          </div>
          <div>
            <span className="font-semibold">Numbers Count:</span> {numbers.length}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Test Result:</span>{' '}
            {clickCount > 0 ? (
              <span className="text-green-600 font-bold">✅ WORKING!</span>
            ) : (
              <span className="text-orange-600">⏳ Waiting for click...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
