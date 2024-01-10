# VK Sudoku Solver Extension

## Description
The Vkontakte Sudoku Solver is a well-made Google Chrome extension built to easily solve Sudoku puzzles on Vkontakte. This add-on fits smoothly into the browser, giving Sudoku fans a quick and dependable way to solve puzzles. It's made to work great for long periods, tested extensively for stability and skill in sessions lasting around 8 hours.

## Demo
[video placeholder]()

## Motivation
The idea for this project came from wanting to explore and understand the Google Chrome Extension API. The goal was to create a Chrome extension specifically designed to boost rating points in the Vkontakte app.

## Discussion
The development had its challenges that needed creative solutions. One big problem came up when trying to work with the iframe on the page. It was clear that usual methods weren't enough, so we had to use special tools like a proxy server.

Making the Google Chrome extension itself was tough, mainly because navigating the API was tricky. The lack of clear instructions and examples on important topics made things hard during development.

We did a lot of research on what the Google Chrome Extension API can do and how to deal with iframes. Getting a better grasp made the job easier, mostly focusing on creating a proxy and getting it to work well. That helped us overcome these hurdles during development.

## Install & Run
To begin, import the project as a Chrome extension, ensuring that developer mode is enabled. Following this, initiate the middleware to serve the proxied HTML by executing the following steps:

```
$ git clone vk-sudoku-solver-extension
$ cd vk-sudoku-solver-extension/server
$ node main.js
```

The commands will set up the necessary environment to deploy the extension and facilitate the proxied HTML functionality, enabling seamless usage of the Vkontakte Sudoku Solver within the Google Chrome browser.