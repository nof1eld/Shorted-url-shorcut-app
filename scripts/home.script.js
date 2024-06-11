const URL = 'https://infobrains-bc.onrender.com';
// you can check docs here https://infobrains-bc.onrender.com/docs

const input = document.getElementById('normalUrl');
const generate = document.getElementById('generate');
const shortUrl = document.getElementById('short');
const listurls = document.getElementById('listurls');
// const deleteurl = document.getElementById('deleteurl');
// let del;
const createShortURLHandler = async (url) => {
  try {
    // we will get the token from localstorage now
    const token = localStorage.getItem('token');

    // as you can see now we did add the token in the header
    // we always need to send token in header for any private APIs
    const response = await fetch(`https://infobrains-bc.onrender.com/private/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth': token
      },
      body: JSON.stringify({url})
    });

    // in order to access the response of the api we need to do this
    // here we are getting the json from the api response
    const result = await response.json();
    console.log(result.data);
    // if we can't create shortUrl it will return null
    // in most cases it will give you a new URL
    return result?.data?.shortUrl || null;
  } catch (err) {
    console.error(err);
  }
};

const getAllUrlsHandler = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${URL}/private/url`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth': token
      }
    });

    const result = await response.json();
    console.log(result.data);

    const history = document.getElementById('history');
    
    while (history.firstChild) {
      history.removeChild(history.firstChild);
    }
    for (let i = result.data.length - 1; i >= 0; i--) {
      const hisChild = document.createElement('div');
      const actions = document.createElement('div')
      const original = document.createElement('a');

      const del = document.createElement('button');
      const copy = document.createElement('button');
      const update = document.createElement('button');

      history.appendChild(hisChild);
      hisChild.appendChild(original);
      hisChild.appendChild(actions);

      actions.appendChild(del);
      actions.appendChild(copy);
      actions.appendChild(update);

      copy.innerHTML = 'copy';
      update.innerHTML = 'update';
      del.innerHTML = 'del';


      // original.textContent = result.data[i].longUrl;
      // short.textContent = result.data[i].shortUrl;
      original.textContent = result.data[i].longUrl;
      original.href = result.data[i].shortUrl;
      original.target = '_blank';
      
      del.addEventListener('click', async () => {
      await remove(result.data[i].id);
      });
      copy.addEventListener('click', async () => {
        navigator.clipboard.writeText(result.data[i].shortUrl);
        if (navigator.clipboard.writeText(result.data[i].shortUrl)) {
          copy.innerHTML = 'copied';
        }
      });
      update.addEventListener('click', async () => {
        const newUrl = prompt('Enter new URL');
        if (newUrl) {
          await updateUrl(result.data[i].id, newUrl);
          await getAllUrlsHandler();
        }
      });
      

    }
    //remove previous history

    return result?.data || null;
  } 
  catch (err) {
    console.error(err);
  }
};

const remove = async (i) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${URL}/private/url/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth': token
      }
    });
    const result = await response.json();
    console.log(result.message);
  } 
  catch (error) {
    console.error(error);
  }
};

const updateUrl = async (id, url) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${URL}/private/url/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth': token
      },
      body: JSON.stringify({url})
    });

    const result = await response.json();
    console.log(result.data);
    return result?.data || null;
  } 
  catch (err) {
    console.error(err);
  }
}

const userEmail = localStorage.getItem('email');
const username = localStorage.getItem('name');

console.log(userEmail);
console.log(username);

// don't remove this code,
// copy it in each page you need to block user if he is not logged in
// Note: always put it at the end of your code this syntax called IIFEs
// it will always run first
(() => {
  // check if user is logged in otherwise we will return the user to login page
  const token = localStorage.getItem('token');
  if (!token) window.location.href = '../index.html';
})();

generate.addEventListener('click', async () => {
  console.log(input.value);
  await createShortURLHandler(input.value);
  await getAllUrlsHandler();

  navigator.clipboard.writeText(shortUrl.value);
  shortUrl.value = '';
  input.value = '';

});

