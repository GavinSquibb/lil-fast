import React, { useRef, useState, useEffect } from 'react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import OpenAI from "openai";

// DO NOT COMMIT
const apiKey = "YOUR-API-KEY-HERE";

// Basic UI components
const Button = ({ onClick, disabled=false, children, className }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className}`}
  >
    {children}
  </button>
);

const Input = React.forwardRef(({ type, value, onChange, placeholder, className }, ref) => (
  <input 
    type={type} 
    value={value} 
    onChange={onChange} 
    placeholder={placeholder}
    className={`border rounded px-2 py-1 ${className}`}
    ref={ref}
  />
));

const Select = ({ value, onChange, children, className }) => (
  <select 
    value={value} 
    onChange={onChange} 
    className={`border rounded px-2 py-1 ${className}`}
  >
    {children}
  </select>
);

const CanvasDrawingApp = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [numIterations, setNumIterations] = useState(2);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setUploadedImage(img); // Set the uploaded image to state so we can use it when canvas cleared
          drawUploadedImage(img); // Also pass to function to draw so we dont need to deal with null state here
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const drawUploadedImage = (image) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (image) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = ( clearUpload ) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (uploadedImage && !clearUpload) drawUploadedImage(uploadedImage);
  };

  const clearUploadedImage = () => {
    // clear state, canvas and input
    if (uploadedImage) {
      setUploadedImage(null);
      clearCanvas(true);
      fileInputRef.current.value = '';
    }
  };
   

  const sendToServer = async () => {
    setIsLoading(true);
    const canvas = canvasRef.current;
    const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    
    const formData = new FormData();
    formData.append('image', imageBlob, 'drawing.png');
    formData.append('prompt', prompt);
    formData.append('num_iterations', numIterations.toString());

    try {
      const response = await fetch('https://lightnote-ai--img-model-inference.modal.run', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server response was not ok');
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate image. Please try again.');
      setIsLoading(false);
    }
  };

  const autocompletePrompt = async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are responsible for autocompleting a prompt that a user is creating to provide context to a photo editing program." },
            {
                role: "user",
                content: "Autocomplete the following prompt: " + prompt,
            },
        ],
      });
      console.log(completion.choices[0].message);
      setPrompt(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to autocomplete prompt. Please try again.');
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="border border-gray-300"
          style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
        />
      <div className="mt-4 space-y-4 w-full max-w-md flex">
        <Input
          type="file"
          onChange={handleImageUpload}
          className="w-full"
          ref={fileInputRef}
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full"
        />
        <Select
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full"
        >
          <option value="2">Small</option>
          <option value="5">Medium</option>
          <option value="10">Large</option>
        </Select>
        <Input
          type="text"
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full"
        />
        <Button onClick={autocompletePrompt} disabled={!apiKey} className="w-full">Autocomplete Prompt</Button>
        <Select
          value={numIterations}
          onChange={(e) => setNumIterations(Number(e.target.value))}
          className="w-full"
        >
          <option value="1">Rapid</option>
          <option value="10">Enhanced</option>
        </Select>
        <Button onClick={() => clearCanvas(false)} className="w-full">Clear Canvas</Button>
        <Button onClick={clearUploadedImage} disabled={!uploadedImage} className="w-full">Clear Uploaded Image</Button>
        <Button onClick={sendToServer} disabled={!prompt.length || isLoading} className="w-full">Send to Server</Button>
      </div>
      {isLoading && <ClimbingBoxLoader />}
      {generatedImage && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Generated Image:</h2>
          <img src={generatedImage} alt="Generated" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default CanvasDrawingApp;
