
// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');
const regExpValidEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editUsername = document.querySelector('.edit-username');
const editPhoto = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');
const postsWrapper = document.querySelector('.posts');
const loginError = document.querySelector('.login-error');
const buttonNewPost = document.querySelector('.new-post-btn');
const addPostElem = document.querySelector('.add-post');
const errorText = document.querySelector('.error-text');

const listUsers = [
    {
    email: 'pershukow@gmail.com',
    password: '111111pk',
    displayName: 'Kiril345',
    photo: 'https://i.work.ua/sent_photo/a/9/b/a9b3f9cf692101c55c325af8bd9ac4c0.jpg'
    },
    {
    email: 'vova@gmail.com',
    password: '111111pk',
    displayName: 'vova',
    photo : '',
    }
];


const setUsers = {
    user: null,
    logIn(email, password, handler ) {
        const user = this.getUser(email);
        console.log(user);
        if (!regExpValidEmail.test(email)) { 
        loginError.innerHTML = 'некорректный email';
        return;
    }
      if(user == null) {
        loginError.innerHTML = 'пользователь не найден';
      }
      if(user && user.password === password){
        this.authorizedUser(user) 
        handler();
      } 
      if(user && user.password !== password){
        loginError.innerHTML ='неправильный логин или пароль';
      }
    },
    logOut(handler) {
      this.user = null;
      this.displayName = null;
      editContainer.classList.remove('visible');
      handler();
    },
    signUp(email, password, handler) {
      if (!regExpValidEmail.test(email)) { 
        loginError.innerHTML = 'некорректный email';
        return;
      }
      if (!this.getUser(email)) {
        const user = {email, password, displayName: email.substring(0, email.indexOf('@'))};
        listUsers.push(user);
        this.authorizedUser(user);
        handler();
      } else {
        loginError.innerHTML = 'такой пользователь уже сущствует';
      }
    },
    editUser(userName, userPhoto, handler) {
      if (userName) {
        this.user.displayName = userName;
      }
      if (userPhoto) {
        this.user.photo = userPhoto;
      }
      handler();
    },
    getUser(email) {
      console.log(email)
      return listUsers.find(item => item.email === email);
      
    },
    authorizedUser(user) {
      this.user = user;
  
    }
  };
  
  
  const setPosts = {
    allPosts: [
      {
        title: 'Заголовлок поста',
        text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему букв деревни предложения, ручеек залетают продолжил парадигматическая? Но языком сих пустился, запятой своего его снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую подпоясал? Лучше, щеке подпоясал приставка большого курсивных на берегу своего? Злых, составитель агентство что вопроса ведущими о решила одна алфавит!',
        tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
        author: {displayName: 'kirill', photo:'https://i.work.ua/sent_photo/a/9/b/a9b3f9cf692101c55c325af8bd9ac4c0.jpg'},
        date: '11.11.2020',
        like: 15,
        comments: 7,
      },
      {
        title: 'Заголовлок поста2',
        text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему букв деревни предложения, ручеек залетают продолжил парадигматическая? Но языком сих пустился, запятой своего его снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую подпоясал? Лучше, щеке подпоясал приставка большого курсивных на берегу своего? Злых, составитель агентство что вопроса ведущими о решила одна алфавит!',
        tags: ['свежее', 'горячее', 'мое', 'случайность'],
        author:  {displayName: 'vova', photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTY993OX0n3P25J7siajFd79O6Ec5PlwxAraQ&usqp=CAU'},
        date: '11.08.2020',
        like: 23,
        comments: 14,
      },
      {
        title: 'Заголовлок поста3',
        text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему букв деревни предложения, ручеек залетают продолжил парадигматическая? Но языком сих пустился, запятой своего его снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую подпоясал? Лучше, щеке подпоясал приставка большого курсивных на берегу своего? Злых, составитель агентство что вопроса ведущими о решила одна алфавит!',
        tags: ['свежее', 'горячее', 'мое', 'случайность'],
        author: {displayName: 'irinka', photo:'https://trikky.ru/wp-content/blogs.dir/1/files/2018/08/05/beautiful-beautyful-drawing-girl-Favim.com-51211121.jpg'},
        date: '11.08.2020',
        like: 23,
        comments: 14,
      },
    ],
    
    addPost(title, text, tags, handler) {
      
  
      this.allPosts.unshift({
        title,
        text,
        tags: tags.split(',').map(item => item.trim()),
        author: {
          displayName: setUsers.user.displayName,
          photo: setUsers.user.photo,
        },
        date: new Date().toLocaleDateString(),
        like: 0,
        comments: 0,
      })
      if (handler) {
        handler();
      }
    }
  };
  
  
  
  const showAllPosts = () => {  //ренедерим все посты
    let postsHTML = '';
  
    setPosts.allPosts.forEach(({title, text, date, like, tags, author, comments}) => {
  
    postsHTML += `
    <section class="post">
      <div class="post-body">
        <h2 class="post-title">${title}</h2>
        <p class="post-text">${text}</p>
        <div class="tags">
          ${tags.map(function(num){
            if (num.length > 0) return `<a href="${num}" class="tag">#${num}</a>`})}
        </div>
      </div>    
      <div class="post-footer">
        <div class="post-buttons">
          <button class="post-button likes">
            <svg width="19" height="20" class="icon icon-like">
              <use xlink:href="img/icons.svg#like"></use>
            </svg>
            <span class="likes-counter">${like}</span>
          </button>
          <button class="post-button comments">
            <svg width="21" height="21" class="icon icon-comment">
              <use xlink:href="img/icons.svg#comment"></use>
            </svg>
            <span class="comments-counter">${comments}</span>
          </button>
          <button class="post-button save">
            <svg width="19" height="19" class="icon icon-save">
              <use xlink:href="img/icons.svg#save"></use>
            </svg>
          </button>
          <button class="post-button share">
            <svg width="17" height="19" class="icon icon-share">
              <use xlink:href="img/icons.svg#share"></use>
            </svg>
          </button>
        </div>
        <div class="post-author">
          <div class="author-about">
            <a href="#" class="author-username">${author.displayName}</a>
            <span class="post-time">${date}</span>
          </div>
          <a href="#" class="author-link"><img src=${author.photo || "img/avatar.svg"} alt="avatar" class="author-avatar"></a>
        </div>
      </div>
    </section>`
    })
    
    postsWrapper.innerHTML = postsHTML
  
    addPostElem.classList.remove('visible');
    postsWrapper.classList.add('visible');
  
  };
  
  
  const toggleAuthDom = () => {
    const user = setUsers.user;
    console.log('user', user);
    loginError.innerHTML = '';
  
    if (user) {
      loginElem.style.display = 'none'
      userElem.style.display = '';
      userNameElem.textContent = user.displayName;
      userAvatarElem.src = user.photo || 'img/avatar.svg';
      buttonNewPost.classList.add('visible');
  
    } else {
      loginElem.style.display = ''
      userElem.style.display = 'none';
      buttonNewPost.classList.remove('visible');
      addPostElem.classList.remove('visible');
      postsWrapper.classList.add('visible');
      
    }
  };
  
  
  const init = () => {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      if (emailInput.value && passwordInput.value) {
      setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom );
      console.log(passwordInput.value);
      } else {
        loginError.innerHTML = 'введите логин и пароль';
      }
      loginForm.reset();
    
    });
    
  
    exitElem.addEventListener('click', event => {
      event.preventDefault();
      setUsers.logOut(toggleAuthDom);
    });
    
  
    loginSignup.addEventListener('click', event => {
      event.preventDefault();
      if (emailInput.value && passwordInput.value) {
      setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom);
      } else {
        loginError.innerHTML = 'введите логин и пароль';
      }
      if (setUsers.user != null) {
        editUsername.value = setUsers.user.displayName
        editContainer.classList.toggle('visible');
      } 
      loginForm.reset();
    });
    
  
    editElem.addEventListener('click', event => {
      event.preventDefault();
      //logIn();
      editUsername.value = setUsers.user.displayName
      editContainer.classList.toggle('visible');
      
    
    });
    
  
    editContainer.addEventListener('submit', event => {
      event.preventDefault();
      setUsers.editUser(editUsername.value, editPhoto.value, toggleAuthDom);
      editContainer.classList.remove('visible');
    });
  
  
    buttonNewPost.addEventListener('click', event => {
      event.preventDefault();
      addPostElem.classList.add('visible');
      postsWrapper.classList.remove('visible');
    });
  
  
    addPostElem.addEventListener('submit', event => {
      event.preventDefault();
      const { title, text, tags } = addPostElem.elements;
      console.log(title, text, tags);
      if (title.value.length < 6 ) {
        errorText.innerHTML += `<div class="error-title">слишком короткий заголовок</div>`;
        setTimeout(() => errorText.innerHTML = '', 2000);
        return;
      }
  
      if (text.value.length < 100 ) {
        errorText.innerHTML += `<div class="error-title">слишком короткий текст</div>`;
        setTimeout(() => errorText.innerHTML = '', 2000);
        return;
      }
  
      setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
      addPostElem.reset();
    });
  
  
    // отслеживаем клик по кнопке меню и запускаем функцию 
    menuToggle.addEventListener('click', event => {
    // отменяем стандартное поведение ссылки
    event.preventDefault();
    // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
    });
  
    toggleAuthDom();
    showAllPosts();
  
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });
  
  
  
  
  
  
  