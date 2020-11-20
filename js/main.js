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
console.log(firebase);

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
const postElem = document.querySelector('.post');
const loginError = document.querySelector('.login-error');
const buttonNewPost = document.querySelector('.new-post-btn');
const addPostElem = document.querySelector('.add-post');
const errorText = document.querySelector('.error-text');
const loginForgetElem = document.querySelector('.login-forget');
//const likesElem = document.querySelector('.likes');
const likesCounter = document.querySelector('.likes-counter');


const setUsers = {
  user: null,
  initUser(hendler) {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.user = user;
      } else {
        this.user = null;
      }
      if(hendler)hendler();
    })

  },
  logIn(email, password) {
    if (!regExpValidEmail.test(email)) { 
      loginError.innerHTML = 'некорректный email';
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(err => {
      const errCode = err.code;
      const errMessage = err.message;
      if(errCode === 'auth/wrong-password') {
        console.log(errMessage);
        loginError.innerHTML ='Неверный пароль';
      } else if(errCode === 'auth/user-not-found') {
        console.log(errMessage);
        loginError.innerHTML = 'Пользователь не найден';
      } else {
        alert(errMessage);
      }
      console.log(err);
    })  
  },
  logOut(handler) {
    firebase.auth().signOut();
    handler();
  },
  signUp(email, password, handler) {
    if (!regExpValidEmail.test(email)) { 
      loginError.innerHTML = 'некорректный email';
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      this.editUser(email.substring(0, email.indexOf('@')), null, handler)
    })
    .catch(err => {
      const errCode = err.code;
      const errMessage = err.message;
      if(errCode === 'auth/weak-password') {
        console.log(errMessage);
        loginError.innerHTML = 'Пароль должен содержать не менее 6 символов';
      } else if(errCode === 'auth/email-already-in-use') {
        console.log(errMessage);
        loginError.innerHTML = 'Пользователь с таким email уже существует';
      } else {
        alert(errMessage);

      }
      console.log(err);
    });
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
      loginError.innerHTML = 'ошибка, письмо для восстановления пароля не отправлено';
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
      console.log(this.allPosts)
      handler();
    })
  },
  addLikes(event) {
    const target = event.target;
    const likesElem = target.closest('.likes');

    if(likesElem) {
      const post = target.closest('.post');
      const id = post.id;
      const likePost = setPosts.allPosts.find(item => item.id == id);
      const indexPost = setPosts.allPosts.findIndex(item => item.id == id);
      const userLike = likePost.likesUsers.find(item => item == setUsers.user.uid);
      if(!userLike) {
        likePost.like += 1;
        likePost.likesUsers.unshift(setUsers.user.uid);
        firebase.database().ref('post/' + indexPost + '/like').set(likePost.like);
        firebase.database().ref('post/' + indexPost + '/likesUsers').set(likePost.likesUsers); 
      }
      if(userLike) {
        likePost.like -= 1;
        firebase.database().ref('post/' + indexPost + '/like').set(likePost.like);
        const userDisLike = likePost.likesUsers.findIndex(item => item == setUsers.user.uid);
        likePost.likesUsers.splice(userDisLike, 1);
        firebase.database().ref('post/' + indexPost + '/likesUsers').set(likePost.likesUsers);
      }
    }
  }
};




const showAllPosts = () => { //ренедерим все посты
  let postsHTML = '';

  setPosts.allPosts.forEach(({id, title, text, tags, author, date, like, comments}) => {

  postsHTML += `
  <section class="post" id=${id}>
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
  postsWrapper.classList.remove('hide');

};


const toggleAuthDom = () => {
  const user = setUsers.user;
  console.log(user);
  loginError.innerHTML = '';

  if (user) {
    loginElem.style.display = 'none'
    userElem.classList.add('visible');
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photoURL || 'img/avatar.svg';
    buttonNewPost.classList.add('visible');
  } else {
    loginElem.style.display = ''
    userElem.classList.remove('visible');
    buttonNewPost.classList.remove('visible');
    addPostElem.classList.remove('visible');
    postsWrapper.classList.remove('hide'); 
  }
};


const init = () => {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    if (emailInput.value && passwordInput.value) {
    setUsers.logIn(emailInput.value, passwordInput.value);
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
  });


  addPostElem.addEventListener('submit', event => {
    event.preventDefault();
    const { title, text, tags } = addPostElem.elements;
    console.log(title, text, tags);
    if (title.value.length < 6 ) {
      errorText.innerHTML += `<div class="error-title">слишком короткий заголовок</div>`;
      timer();
      return;
    }

    if (text.value.length < 100 ) {
      errorText.innerHTML += `<div class="error-title">слишком короткий текст</div>`;
      timer();
      return;
    }

    setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
    addPostElem.reset();
  });

  loginForgetElem.addEventListener('click', event => {
    event.preventDefault();
    if (emailInput.value) { 
      setUsers.sendForget(emailInput.value)
    } else {
      loginError.innerHTML = 'для восстановления пароля введите email';
    }
  });

  postsWrapper.addEventListener('click', event => {
    if (setUsers.user !=null) {
      setPosts.addLikes(event)
    } else { 
      errorText.innerHTML += `<div class="error-title">выполните вход на сайт</div>`;
      timer();

    }
  });

  function timer() {
    setTimeout(() => errorText.innerHTML = '', 2000);
  }
    //event.preventDefault();
    //setUsers
  //})


  // отслеживаем клик по кнопке меню и запускаем функцию 
  menuToggle.addEventListener('click', event => {
  // отменяем стандартное поведение ссылки
  event.preventDefault();
  // вешаем класс на меню, когда кликнули по кнопке меню 
  menu.classList.toggle('visible');
  });

  setUsers.initUser(toggleAuthDom);
  setPosts.getPosts(showAllPosts);

}

document.addEventListener('DOMContentLoaded', () => {
  init();
});





