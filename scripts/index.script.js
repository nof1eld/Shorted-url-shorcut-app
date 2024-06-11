const URL = 'https://infobrains-bc.onrender.com'
// you can check docs here https://infobrains-bc.onrender.com/docs

const loginHandler = async (email, password) => {
  // don't forget try {} catch(err){} block :)
  try {

    // this code will allow us to call the api with method POST
    // we are sending the email and password in the request body
    const response = await fetch(`${URL}/public/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    // in order to access the response of the api we need to do this
    // here we are getting the json from the api response
    const result = await response.json();

    // if password or email is false
    if (!result?.status) return result?.message

    // save auth token
    // this token allow you to use the next apis that have /private
    // /public is a public APIs that you can access without authentication
    // while /private APIs takes auth token to allow you to use them
    // you can access auth token in result?.data?.token
    // we are going for now to store this token
    localStorage.setItem('token', result?.data?.token)

    // we also need to save use data in local storage soo we can access them later
    localStorage.setItem('email', result?.data?.email);
    localStorage.setItem('name', result?.data?.name);

    // redirect to the next page after a success login
    return window.location.href = '../home.html'
  } catch (err) {
    console.error(err)
  }
}

const form = document.querySelector('form')
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.querySelector('#email').value
  const password = document.querySelector('#password').value
  const error = document.querySelector('#error')

  if (password.length < 6)
    return error.innerHTML = 'Password must be at least 6 characters'

  // in case of error, we will show it in the form
  const result = await loginHandler(email, password)
  console.log(result);
  error.innerHTML = result
})
