# Lightnote Technical Task

## Hello 👋
We're very excited at the prospect of working with you. Thanks for taking the time to speak with us and for willing to undergo this exercise. We've designed a technical task that should take *no more* than 1 hour of your time. It features a type of problem that we have worked on at Lightnote and can hopefully shed more light on the kinds of features you may help build alongside us. 

## Task Overview
You're provided with a basic React application that allows users to draw on a canvas and send the drawing to a server for real-time image generation. Your task is to enhance this application by implementing image upload functionality, so that users can use our models to reinterpret their own images. Users can also draw on top of their images and use this to guide the output of our models. 

## Getting Started

Clone this repository. Install dependencies with `npm install` and start the development server with `npm start`.

Feel free to play around to understand the functionality better. Sketch on the canvas with any colour, type in a prompt, and send it through to the server. 

**NOTE**: 
1. The image generation model used here is hosted by us on GPUs which are currently not set up to be running all the time. There may be a lag after the first request to the server as the GPUs boot up. Please be patient if you encounter any delays, it should take a minute or two at most. 
2. The server returns an error if no prompt is provided.


## Task Details

Implement functionality that allows users to upload their own image to the canvas, draw over it, and send the drawn-over image to the AI model on our server. You are already provided with some helper functions in `CanvasDrawingApp.jsx`. However, feel free to implement this in whichever way you think best.


### Implementation Notes

- The main component is located in `src/CanvasDrawingApp.jsx.`
- Look for TODO comments in the code for specific areas that may need implementation.
- Ensure that uploaded images are properly scaled to fit the 512x512 canvas.
- Make sure that drawing on the canvas works correctly with an uploaded image in the background.

## Submission
Once you've completed the task, please either push your code into a new public repository and share the link OR send across a zip file with the code to zo@lightnote.io.

Include any notes you may want to share on your implementation in a `SOLUTION.md` file.

## Bonus Tasks
If you complete the main task and have additional time, consider how you may improve the feature. Some ideas include:
- Add loading screens while the server boots up.
- Automatically generate images when the prompt changes or someone draws on the canvas.
- Add functionality for adding shapes to the canvas.
- Implement prompt autocomplete using the OpenAI API.

These are just some suggestions. Feel free to think of and implement your own ideas to improve the user experience! 
For inspiration, feel free to also explore our early prototype of a similar feature: https://lightnote-ai--img-canvas.modal.run/

### Evaluation Criteria
We will evaluate your submission based on:

- Functionality: Does the implementation work as expected?
- Creativity: If you implemented any bonus features, how well do they enhance the application?

Have fun!