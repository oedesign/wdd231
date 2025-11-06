// --- Improved, accessible nav toggle ---
    const toggleIcon = document.getElementById('toggleIcon');
    const menu = document.querySelector('.nav-links');

    function setMenu(open){
      if(open){
        menu.style.display = 'flex';
        toggleIcon.textContent = '✖';
        toggleIcon.setAttribute('aria-expanded','true');
      }else{
        menu.style.display = '';// allow CSS to handle display on large screens
        toggleIcon.textContent = '☰';
        toggleIcon.setAttribute('aria-expanded','false');
      }
    }

    // Ensure correct initial state depending on viewport
    const mq = window.matchMedia('(max-width:868px)')
    function handleMq(e){
      if(e.matches){
        menu.style.display = 'none';
        toggleIcon.setAttribute('aria-hidden','false');
      }else{
        menu.style.display = 'flex';
        toggleIcon.setAttribute('aria-hidden','true');
      }
    }
    mq.addListener(handleMq);
    handleMq(mq);

    toggleIcon.addEventListener('click',()=>{
      const isOpen = toggleIcon.getAttribute('aria-expanded') === 'true';
      setMenu(!isOpen);
    });

    // Get current year
    const year = new Date().getFullYear();
    document.getElementById("currentyear").textContent = year;

    // Get the last modified date of the document
    const lastmodification = document.lastModified;
    const lastEl = document.getElementById("lastModified");
    if(lastmodification){
      lastEl.textContent = "This page was last modified on: " + lastmodification;
    }else{
      lastEl.textContent = "Last modified date not available.";
    }
    lastEl.style.color = "black";

    // --- Course data --- (unchanged structure)
    const courses = [
      { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, certificate: 'Web and Computer Programming', description: 'This course will introduce students to programming...', technology: [ 'Python' ], completed: true },
      { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'This course introduces students to the World Wide Web...', technology: [ 'HTML','CSS' ], completed: true },
      { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, certificate: 'Web and Computer Programming', description: 'CSE 111 students become more organized...', technology: [ 'Python' ], completed: true },
      { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, certificate: 'Web and Computer Programming', description: 'This course will introduce the notion of classes and objects...', technology: [ 'C#' ], completed: true },
      { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'This course builds on prior experience...', technology: [ 'HTML','CSS','JavaScript' ], completed: true },
      { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, certificate: 'Web and Computer Programming', description: 'This course builds on prior experience...', technology: [ 'HTML','CSS','JavaScript' ], completed: false }
    ];

    // DOM refs
    const coursesEl = document.getElementById('courses');
    const totalCreditsEl = document.getElementById('totalCredits');
    const filterButtons = document.querySelectorAll('.filters button');

    function renderCourseList(list){
      coursesEl.innerHTML = '';
      if(list.length === 0){
        coursesEl.innerHTML = '<div class="note">No courses to show.</div>';
        totalCreditsEl.textContent = '0';
        return;
      }

      list.forEach((course, idx) => {
        const card = document.createElement('article');
        card.className = 'course-card' + (course.completed ? ' completed' : '');
        card.setAttribute('role','listitem');

        const left = document.createElement('div');
        left.className = 'left';

        const meta = document.createElement('div');
        meta.className = 'meta';

        const code = document.createElement('div');
        code.className = 'code';
        code.textContent = `${course.subject} ${course.number}`;

        // Use a heading (h3) inside the article for better semantics and to improve SEO/A11Y
        const title = document.createElement('h3');
        title.className = 'title';
        title.id = `course-title-${idx}`;
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

      const total = list.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
      totalCreditsEl.textContent = total;
    }

    renderCourseList(courses);

    filterButtons.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected','true');

        const subject = btn.dataset.subject;
        if(subject === 'ALL'){
          renderCourseList(courses);
          return;
        }
        const filtered = courses.filter(c => c.subject === subject);
        renderCourseList(filtered);
      });
    });
