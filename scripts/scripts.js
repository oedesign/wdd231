const toggleIcon = document.getElementById('toggleIcon');
const menu = document.querySelector('.nav-links');

toggleIcon.addEventListener('click', () => {
  if (menu.style.display === 'block') {
    menu.style.display = 'none';
    toggleIcon.textContent = '☰'; // Menu bar icon
  } else {
    menu.style.display = 'block';
    toggleIcon.textContent = '✖'; // Close icon
  }
});

// Get current year
const year = new Date().getFullYear();
document.getElementById("currentyear").textContent = year;

// Get the last modified date of the document
const lastmodification = document.lastModified; 
document.getElementById("lastModified").textContent =
  "This page was last modified on: " + lastmodification;
document.getElementById("lastModified").style.color = "black";


// 


// --- Course data (updated: mark completed true for courses you've completed) ---
const courses = [
  {
      subject: 'CSE',
      number: 110,
      title: 'Introduction to Programming',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
      technology: [ 'Python' ],
      completed: true // <-- marked completed
  },
  {
      subject: 'WDD',
      number: 130,
      title: 'Web Fundamentals',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming.',
      technology: [ 'HTML','CSS' ],
      completed: true // <-- marked completed
  },
  {
      subject: 'CSE',
      number: 111,
      title: 'Programming with Functions',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions.',
      technology: [ 'Python' ],
      completed: true
  },
  {
      subject: 'CSE',
      number: 210,
      title: 'Programming with Classes',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
      technology: [ 'C#' ],
      completed: true
  },
  {
      subject: 'WDD',
      number: 131,
      title: 'Dynamic Web Fundamentals',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
      technology: [ 'HTML','CSS','JavaScript' ],
      completed: true
  },
  {
      subject: 'WDD',
      number: 231,
      title: 'Frontend Web Development I',
      credits: 2,
      certificate: 'Web and Computer Programming',
      description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
      technology: [ 'HTML','CSS','JavaScript' ],
      completed: false // <-- marked completed
  }
];

// --- DOM references ---
const coursesEl = document.getElementById('courses');
const totalCreditsEl = document.getElementById('totalCredits');
const filterButtons = document.querySelectorAll('.filters button');

// Render function: accepts an array of course objects and draws them
function renderCourseList(list){
  coursesEl.innerHTML = '';

  if(list.length === 0){
    coursesEl.innerHTML = '<div class="note">No courses to show.</div>';
    totalCreditsEl.textContent = '0';
    return;
  }

  list.forEach(course => {
    const card = document.createElement('article');
    card.className = 'course-card' + (course.completed ? ' completed' : '');
    card.setAttribute('role','article');

    const left = document.createElement('div');
    left.className = 'left';

    const meta = document.createElement('div');
    meta.className = 'meta';

    const code = document.createElement('div');
    code.className = 'code';
    code.textContent = `${course.subject} ${course.number}`;

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = course.title;

    const tech = document.createElement('div');
    tech.className = 'note';
    tech.textContent = course.technology.join(' • ');

    meta.appendChild(code);
    meta.appendChild(title);

    left.appendChild(meta);
    left.appendChild(tech);

    const right = document.createElement('div');
    right.style.display = 'flex';
    right.style.flexDirection = 'column';
    right.style.alignItems = 'flex-end';
    right.style.gap = '8px';

    const credits = document.createElement('div');
    credits.className = 'badge';
    credits.textContent = `${course.credits} cr`;

    const status = document.createElement('div');
    status.className = 'note';
    status.textContent = course.completed ? 'Completed' : 'Not completed';

    right.appendChild(credits);
    right.appendChild(status);

    card.appendChild(left);
    card.appendChild(right);

    coursesEl.appendChild(card);
  });

  // compute total credits using reduce (only for visible list)
  const total = list.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  totalCreditsEl.textContent = total;
}

// Initial render with all courses
renderCourseList(courses);

// Filter handling
filterButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const subject = btn.dataset.subject;
    if(subject === 'ALL'){
      renderCourseList(courses);
      return;
    }

    const filtered = courses.filter(c => c.subject === subject);
    renderCourseList(filtered);
  });
});

// Example: If the data source changes at runtime, call renderCourseList(newArray)
// For example, to mark CSE 110 completed later:
// courses[0].completed = true; renderCourseList(courses);
