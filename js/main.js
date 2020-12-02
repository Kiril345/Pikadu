'use strict';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzw1XzNyxeV0HcUYuFCYmvu6rfRntUEec",
  authDomain: "mypikadu.firebaseapp.com",
  databaseURL: "https://mypikadu.firebaseio.com",
  projectId: "mypikadu",
  storageBucket: "mypikadu.appspot.com",
  messagingSenderId: "692547855430",
  appId: "1:692547855430:web:975a00715fa071d1d15647"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const menuToggle = document.querySelector('#menu-toggle');
const menu = document.querySelector('.sidebar');
const regExpValidEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const login = document.querySelector('.login');
const loginError = document.querySelector('.login-error');
const loginForm = document.querySelector('.login-form');
const loginTitile = document.querySelector('.login-title');
const signUpCloseElem = document.querySelector('.signup-close');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const passwordInputRepeat = document.querySelector('.login-password-repeat');
const signInElem = document.querySelector('.btn-signin');
const signUpElem = document.querySelector('.btn-signup');
const loginForgetElem = document.querySelector('.login-forget');
const loginSignUpElem = document.querySelector('.login-signup');
const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editUsername = document.querySelector('.edit-username');
const editPhoto = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');
const postsWrapper = document.querySelector('.posts');
const buttonNewPost = document.querySelector('.new-post-btn');
const addPostElem = document.querySelector('.add-post');
const errorText = document.querySelector('.error-text');
const logoElem = document.querySelector('.header-logo');
const preloader = document.querySelector('.loader');

const setUsers = {
  user: null,
  initUser(hendler) {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.user = user;
        showAllPosts();
      } else {
        this.user = null;
        showAllPosts();
      }
      if(hendler)hendler();
    })
  },

  logIn(email, password, handler) {
    if (!regExpValidEmail.test(email)) { 
      loginError.innerHTML = 'некорректный email';
      loginForm.reset();
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(err => {
      const errCode = err.code;
      if(errCode === 'auth/wrong-password') {
        loginError.innerHTML ='Неверный пароль';
        passwordInput.value = '';
        return;
      } else if(errCode === 'auth/user-not-found') {
        loginError.innerHTML = 'Пользователь не найден';
        loginForm.reset();
      }
    }) 
    handler();
  },
  logOut(handler) {
    firebase.auth().signOut()
    handler();
  },

  signUp(email, password, handler) {
    if (!regExpValidEmail.test(email)) { 
      loginError.innerHTML = 'некорректный email';
      return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      this.editUser(email.substring(0, email.indexOf('@')), null, handler);
    })
    .catch(err => {
      const errCode = err.code;
      if(errCode === 'auth/weak-password') {
        loginError.innerHTML = 'Пароль должен содержать не менее 6 символов';
      } else if(errCode === 'auth/email-already-in-use') {
        loginError.innerHTML = 'Пользователь с таким email уже существует';
      } 
    });
    handler(editContainer.classList.add('visible'));
  },

  editUser(displayName, photoURL, handler) {
    const user = firebase.auth().currentUser;
    if (displayName) {
      if(photoURL) {
        user.updateProfile({
          displayName,
          photoURL
        }).then(handler)
      } else {
        user.updateProfile({
          displayName
        }).then(handler)
      }
    }
  },

  sendForget(email) {
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      loginError.innerHTML = 'на ваш email было отпрвлено письмо';
    })
    .catch(() => {
      loginError.innerHTML = 'ошибка, письмо не отправлено';
    })
  }
};


const setPosts = {
  allPosts: [],
  
  addPost(title, text, tags, handler) {
    this.allPosts.unshift({
      id: `${(+new Date()).toString(16)}-${setUsers.user.uid}`,
      title,
      text,
      tags: tags.split(',').map(item => item.trim()),
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL,
      },
      date: new Date().toLocaleDateString(),
      like: 0, 
      likesUsers: [1234],    
      comments: 0,
    })
    firebase.database().ref('post').set(this.allPosts)
    .then(() => this.getPosts(handler))
  },

  getPosts(handler) {
    firebase.database().ref('post').on('value', snapshot => {
      this.allPosts = snapshot.val() || [];
      //console.log(this.allPosts)
      preloader.classList.add('loaded');
      handler();
    })
  },
  
  addLikes(event) {
    const likesElem = event.target.closest('.likes');
    if(likesElem) {
      const post = event.target.closest('.post');
      const postId = post.id;
      const map = this.allPosts.map(({id, likesUsers, like}) => ({id, likesUsers, like}));
      const likePost = map.find(item => item.id == post.id);
      const indexPost = map.findIndex(item => item.id == postId);
      const userLike = likePost.likesUsers.find(item => item == setUsers.user.uid);
      function like() {
        firebase.database().ref('post/' + indexPost + '/like').set(likePost.like);
        firebase.database().ref('post/' + indexPost + '/likesUsers').set(likePost.likesUsers);
      }
      if(!userLike) {
        likePost.like += 1;
        likePost.likesUsers.unshift(setUsers.user.uid);
        like();
      }
      if(userLike) {
        likePost.like -= 1;
        const userDisLike = likePost.likesUsers.findIndex(item => item == setUsers.user.uid);
        likePost.likesUsers.splice(userDisLike, 1);
        like();
      }
    };
  },
};

const showAllPosts = () => { //ренедерим все посты
  let user = setUsers.user;
  user == null ? user = '' : user ;
  postsWrapper.textContent = '';
  let postsHTML = '';
  setPosts.allPosts.forEach(function({id, title, text, tags, author, date, like, likesUsers, comments}) {
  let iconLike = (likesUsers.find(item => item == user.uid)) ? "icon-like" : "";
  postsHTML = `
  <section class="post" id=${id}>
    <div class="post-body">
      <div class="post-author">
        <div class="author-about">
          <a href="#" class="author-link"><img src=${author.photo || "img/avatar.svg"} alt="avatar" class="author-avatar"></a>
          <a href="#" class="author-username">${author.displayName}</a>
        </div>
        <div class="post-time">${date}</div>
      </div>
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
          <svg width="19" height="20" class="icon ${iconLike}">
            <use xlink:href="img/icons.svg#like"></use>
          </svg>
          <span class="likes-counter">${like}</span>
        </button>
        <button class="post-button comments">
          <svg width="21" height="21" class="icon">
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
    </div>
  </section>`
  postsWrapper.insertAdjacentHTML('beforeend', postsHTML);
  });
  addPostElem.classList.remove('visible');
  postsWrapper.classList.remove('hide');
};

const toggleAuthDom = () => {
  const user = setUsers.user;
  loginError.innerHTML = '';
  if (user) {
    login.style.display = 'none'
    userElem.classList.add('visible');
    userNameElem.textContent = user.displayName;
    editUsername.value = user.displayName;
    userAvatarElem.src = user.photoURL || 'img/avatar.svg';
    buttonNewPost.classList.add('visible');
  } else {
    login.style.display = ''
    userElem.classList.remove('visible');
    buttonNewPost.classList.remove('visible');
    addPostElem.classList.remove('visible');
    postsWrapper.classList.remove('hide'); 
  }
};

function showMessage(arg) {
  errorText.innerHTML += `<div class="error-title">` + arg + `</div>`;
  setTimeout(() => errorText.innerHTML = '', 2000);
};

function signUpClose() {
  loginForm.classList.remove('show');
  loginTitile.textContent = 'Авторизация';
  loginError.innerHTML = '';
}

const init = () => {

  signInElem.addEventListener('click', event => {
    event.preventDefault();
    if (loginForm.classList.contains('show')){
      return;
    } else {
      if (emailInput.value && passwordInput.value) {
      setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);
      } else {
        loginError.innerHTML = 'введите логин и пароль';
        return;
      }
    }
  });
  
  exitElem.addEventListener('click', event => {
    event.preventDefault();
    editContainer.classList.remove('visible');
    setUsers.logOut(toggleAuthDom);
    signUpClose();
    loginForm.reset();
    editContainer.reset();
  });
  
  loginSignUpElem.addEventListener('click', event => {
    event.preventDefault();
    signInElem.setAttribute('type', "");
    loginError.innerHTML = '';
    loginForm.classList.add('show');
    loginTitile.textContent = 'Регистрация';
  });
  signUpCloseElem.addEventListener('click', event => {
    event.preventDefault();
    signUpClose();
  });
  signUpElem.addEventListener('click', event => {
    event.preventDefault();
    if (emailInput.value && passwordInput.value && passwordInputRepeat.value) {
    } else {
      loginError.innerHTML = 'заполните все поля';
      return;
    }
    if (passwordInput.value !== passwordInputRepeat.value) {
      loginError.innerHTML = 'пароли не совпадают';
      passwordInput.value = ''; 
      passwordInputRepeat.value = '';
      return;
    }  
    if (emailInput.value && passwordInput.value && passwordInputRepeat.value && passwordInput.value === passwordInputRepeat.value) {
      setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom);
      loginForm.reset();
    }
  });

  loginForgetElem.addEventListener('click', event => {
    event.preventDefault();
    if (emailInput.value) { 
      setUsers.sendForget(emailInput.value)
    } else {
      loginError.innerHTML = 'для восстановления пароля введите email';
      return;
    }
  });
  
  editElem.addEventListener('click', event => {
    event.preventDefault();
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
    postsWrapper.classList.add('hide');
    menu.classList.toggle('visible');
  });

  addPostElem.addEventListener('submit', event => {
    event.preventDefault();
    const { title, text, tags } = addPostElem.elements;
    console.log(title, text, tags);
    if (title.value.length < 6 ) {
      showMessage('слишком короткий заголовок');
      return;
    }
    if (text.value.length < 100 ) {
      showMessage('слишком короткий текст');
      return;
    }  
    setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
    addPostElem.reset();
  });

  postsWrapper.addEventListener('click', event => {
    if (setUsers.user != null) {
      setPosts.addLikes(event)
    } else { 
      showMessage('выполните вход на сайт');
      return;
    }
  });

  menuToggle.addEventListener('click', event => {
    event.preventDefault(); 
    menu.classList.toggle('visible');
  });

  logoElem.addEventListener('click',  event => {
    event.preventDefault(); 
    addPostElem.classList.remove('visible');
    postsWrapper.classList.remove('hide');
    menu.classList.remove('visible');
    addPostElem.reset();
  });

  setUsers.initUser(toggleAuthDom);
  setPosts.getPosts(showAllPosts);
};

document.addEventListener('DOMContentLoaded', () => {
  init();
});




