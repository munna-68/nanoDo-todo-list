function renderNewProject(projectName) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  
  li.className = 'project-item';
  span.className = 'project-name';
  span.textContent = projectName; 

  li.appendChild(span);
  document.querySelector('ul').appendChild(li);
  return li;
}

function saveProjectToStorage(projectName) {
  let projects = JSON.parse(localStorage.getItem('projects')) || [];
  
  projects.push(projectName);
  
  localStorage.setItem('projects', JSON.stringify(projects));
}

export function addNewProject() {
  const formGroup = document.querySelector('.add-project-form');
  const inputElement = formGroup.querySelector('.input-text');

  formGroup.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;

    if (e.key === 'Enter') {
      const inputValue = inputElement.value.trim();


      if (inputValue === '') return;
      
      if (inputValue.length > 20) {
        alert("Project name must be 20 characters or less.");
        return;
      }

      formGroup.classList.add('hidden');

      
      saveProjectToStorage(inputValue); 
      
      const li = renderNewProject(inputValue);
      li.classList.add(inputValue);

      inputElement.value = ''; 
    }
  });
}