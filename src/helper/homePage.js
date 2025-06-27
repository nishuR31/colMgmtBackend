// let homePage = `<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>College API Server</title>
//     <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3145/3145765.png" />
//     <script src="https://cdn.tailwindcss.com"></script>
//     <style>
//       body::before {
//         content: "";
//         background-image: url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b');
//         background-size: cover;
//         background-position: center;
//         position: fixed;
//         top: 0; left: 0; right: 0; bottom: 0;
//         opacity: 0.15;
//         z-index: -1;
//       }
//     </style>
//   </head>
//   <body class="font-mono bg-black w-full h-full text-white">
//     <div class="h-full flex w-full flex-col items-center justify-center ">
//       <div class="text-center  space-y-6 w-auto">
//         <h1 class="text-4xl text-5xl  mt-6 font-bold text-amber-400 drop-shadow-xl">🎓 College API Server</h1>
//         <p class="text-lg text-gray-300">Welcome to the official backend server for managing students, faculty, admin and complaints efficiently using REST APIs.</p>

//         <div class="grid gap-4 w-auto mt-8">
//           <a href="/help" class="bg-slate-800 hover:bg-slate-700 transition text-blue-300 px-6 py-3 rounded-lg border border-blue-500 shadow-lg text-lg">🔗 View API Help Page</a>
//         </div>

//         <div class="mt-10">
//           <h2 class="text-2xl font-semibold text-amber-300">Available Modules:</h2>
//           <ul class="mt-4 list-disc list-inside text-left text-gray-200">
//             <li><strong>Admin:</strong> Sign up, sign in, delete, update & token management</li>
//             <li><strong>Faculty:</strong> Auth, profile management, role-based actions</li>
//             <li><strong>Student:</strong> Register, edit, mark assignments, view subject</li>
//             <li><strong>Complaint:</strong> File and respond to academic complaints</li>
//             <li><strong>Subjects & Marks:</strong> Assign subjects and update student scores</li>
//           </ul>
//         </div>

//         <div class="mt-10">
//           <h2 class="text-2xl font-semibold text-amber-300">Tech Stack:</h2>
//           <ul class="mt-4 list-disc list-inside text-left text-gray-200">
//             <li><strong>Node.js & Express:</strong> Fast, flexible backend server</li>
//             <li><strong>MongoDB & Mongoose:</strong> NoSQL database with schema modeling</li>
//             <li><strong>TailwindCSS:</strong> Utility-first CSS for UI</li>
//             <li><strong>JWT:</strong> Secure authentication with token-based system</li>
//             <li><strong>Postman:</strong> API testing and collaboration</li>
//             <li><strong>GitHub:</strong> Version control and source hosting</li>
//           </ul>
//         </div>

//         <div class="mt-10">
//           <h2 class="text-2xl font-semibold text-amber-300">GitHub & Developer Info:</h2>
//           <ul class="mt-4 list-none text-gray-200">
//             <li>👨‍💻 <strong>Developer:</strong> <a href="https://github.com/nishuR31" class="text-blue-400 hover:underline">@your-username</a></li>
//             <li>📁 <strong>Repository:</strong> <a href="https://github.com/nishuR31/colBackendMgmt" class="text-green-400 hover:underline">college-api-server</a></li>
//             <li>📅 <strong>Updated:</strong>${
//               new Date().toLocaleDateString
//             }</li>
//           </ul>
//         </div>

//         <footer class="mt-16 text-sm text-gray-500">
//           &copy; 2025 College Backend System. Made with ❤️ using Express & MongoDB.
//         </footer>
//       </div>
//     </div>
//   </body>
// </html>`;

// export default homePage;

let homePage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>College API Server</title>
    <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3145/3145765.png" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>


    </style>
  </head>
  <body class="font-mono bg-fixed bg-center bg-no-repeat w-full h-full text-white bg-[url('https://i.pinimg.com/originals/6b/c1/5a/6bc15a70d27c6d80baa0d00e3d308908.jpg')]">
    <div class="min-h-screen flex flex-col items-center justify-center py-12 ">
      <div class="text-center space-y-8 w-full p-10 ">
        <h1 class="text-5xl font-bold text-amber-400 drop-shadow-xl">🎓 College API Server</h1>
        <p class="text-lg text-gray-300">Welcome to the official backend server for managing students, faculty, admin and complaints efficiently using REST APIs.</p>

        <div class="flex flex-wrap justify-center gap-4 ">
          <a href="/help" class="bg-slate-800 hover:bg-slate-700 transition text-blue-300 px-6 py-3 rounded-md  border border-blue-500 shadow-lg text-lg">🔗 View API Help Page</a>
        </div>

        <div class="mt-10 text-left   backdrop-blur-sm ">
          <h2 class="text-2xl font-semibold text-amber-300">Available Modules:</h2>
          <ul class="mt-4 list-disc list-inside text-gray-200">
            <li><strong>Admin:</strong> Sign up, sign in, delete, update & token management</li>
            <li><strong>Faculty:</strong> Auth, profile management, role-based actions</li>
            <li><strong>Student:</strong> Register, edit, mark assignments, view subject</li>
            <li><strong>Complaint:</strong> File and respond to academic complaints</li>
            <li><strong>Subjects & Marks:</strong> Assign subjects and update student scores</li>
          </ul>
        </div>

        <div class="mt-10 text-left  backdrop-blur-sm">
          <h2 class="text-2xl font-semibold text-amber-300">Tech Stack:</h2>
          <ul class="mt-4 list-disc list-inside text-gray-200">
            <li><strong>Node.js & Express:</strong> Fast, flexible backend server</li>
            <li><strong>MongoDB & Mongoose:</strong> NoSQL database with schema modeling</li>
            <li><strong>TailwindCSS:</strong> Utility-first CSS for UI</li>
            <li><strong>JWT:</strong> Secure authentication with token-based system</li>
            <li><strong>Postman:</strong> API testing and collaboration</li>
            <li><strong>GitHub:</strong> Version control and source hosting</li>
            <li><strong>Multer:</strong> File uploads handling</li>
            <li><strong>Helmet & CORS:</strong> API security and cross-origin access</li>
          </ul>
        </div>

        <div class="mt-10 text-left  backdrop-blur-sm">
          <h2 class="text-2xl font-semibold text-amber-300">GitHub & Developer Info:</h2>
          <ul class="mt-4 text-gray-200 space-y-1">
            <li>👨‍💻 <strong>Developer:</strong> <a href="https://github.com/nishuR31" class="text-blue-400 hover:underline">@nishuR31</a></li>
            <li>📁 <strong>Repository:</strong> <a href="https://github.com/nishuR31/colBackendMgmt" class="text-green-400 hover:underline">colBackendMgmt</a></li>
            <li>📅 <strong>Updated:</strong> <span id="updated-date"></span></li>
          </ul>
        </div>

        <footer class="mt-16 bottom-0 text-sm p-4 text-white backdrop-blur-sm">
          &copy; 2025 College Backend System. Made with ❤️ using Express, MongoDB, and TailwindCSS.
        </footer>
      </div>
    </div>

    <script>
      document.getElementById('updated-date').textContent = new Date().toLocaleDateString();
    </script>
  </body>
</html>`;

export default homePage;
