import { useState, useRef } from "react";
import default_img from "../Assets/default_img.jfif";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState("/"); // Default image URL
  const [loading, setLoading] = useState(false); // Loading state
  const inputRef = useRef(null); // Reference for the input field

  // Function to generate the image using Hugging Face API
  const imageGenerator = async () => {
    const inputText = inputRef.current?.value.trim(); // Get input value
    if (!inputText) return; // If input is empty, return early

    setLoading(true); // Set loading to true

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Artples/LAI-ImageGeneration-vSDXL-2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.HUGGINGFACE_API_KEY}`,
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            inputs: inputText,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to fetch the image.");
      }

      const blob = await response.blob(); // Get image blob
      const url = URL.createObjectURL(blob); // Create object URL
      setImageUrl(url); // Update state with generated image URL
    } catch (error) {
      console.error("Error during image generation:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Function to download the image
  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "generated-image.png"; // File name
    a.click();
  };

  return (
    <div className="bg-gray-950 h-screen text-white flex justify-center items-center">
      <div className="ai-image-generator min-h-96 flex flex-col p-8 bg-violet-400 rounded-lg">
        <div className="header text-4xl font-bold pb-6">
          AI Image <span className="text-violet-800">Generator</span>
        </div>

        <div className="img_loading flex flex-col justify-center items-center relative">
          {/* Display loading spinner or image */}
          {loading ? (
            <div className="spinner h-80 flex justify-center items-center">
              <div
                className="spinner-border animate-spin inline-block w-24 h-24 border-4 rounded-full border-t-transparent border-violet-800"
                role="status"
              ></div>
            </div>
          ) : (
            <img
              className="h-80 rounded-md"
              src={imageUrl === "/" ? default_img : imageUrl}
              alt="Generated"
            />
          )}

          {/* Download button */}
          {imageUrl !== "/" && !loading && (
            <button
              onClick={downloadImage}
              className="absolute top-4 right-4 p-3 bg-black bg-opacity-50 rounded-full backdrop-blur-sm hover:bg-opacity-70"
            >
              <ArrowDownTrayIcon className="h-6 w-6 text-white" />
            </button>
          )}
        </div>

        <div className="search-box flex flex-col justify-center pt-8">
          <input
            type="text"
            ref={inputRef}
            className="search-input p-3 w-full text-black rounded-md focus:ring-2 focus:ring-violet-700"
            placeholder="Describe what you want to see"
          />
          <button
            className="generate-btn px-6 py-3 bg-violet-700 rounded-md mt-4 text-white font-bold hover:bg-violet-800"
            onClick={imageGenerator}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;
