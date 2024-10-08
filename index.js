import BACKEND from './consts.js'

window.onload = () => {
    sessionStorage.setItem('loading', '0')
    let currentPage = sessionStorage.getItem('currentPage')
    if(currentPage) {
        if(currentPage === 'welcomeEdit') {
            changeComponent(currentPage,false,null,true)
            getNavbarOptions(true)
        }
        else {
            changeComponent(currentPage)
        }
    }
    else {
        changeComponent('welcome')
        getNavbarOptions()
    } 

    if(sessionStorage.getItem('title')) {
        document.querySelector('a.navbar-brand').innerText = sessionStorage.getItem('title')
    }

    let defaultTitle = 'Custom pages'

    document.querySelector('a.navbar-brand').addEventListener('click', () => {
        document.querySelector('a.navbar-brand').innerText = defaultTitle
        sessionStorage.setItem('title', defaultTitle)
    })
    document.querySelector('svg#editIcon').addEventListener('click', () => {
        document.querySelector('a.navbar-brand').innerText = defaultTitle
        sessionStorage.setItem('title', defaultTitle)
    })
    document.querySelector('svg#createIcon').addEventListener('click', () => {
        document.querySelector('a.navbar-brand').innerText = defaultTitle
        sessionStorage.setItem('title', defaultTitle)
    })
}

let xmlhttp = new XMLHttpRequest()
let loadingInterval = null;
xmlhttp.onreadystatechange = () => {
    if(xmlhttp.readyState===4 && xmlhttp.status === 200) {
        sessionStorage.setItem('loading', '0')
        if(loadingInterval) {
            clearTimeout(loadingInterval)
        }
        let main = document.querySelector('main')
        main.innerHTML = xmlhttp.responseText
        executeScript(main)
        manageCodeEditor()
    }
    else {
        if(!sessionStorage.getItem('loading')) {
            sessionStorage.setItem('loading', '0')
        }
        if(!parseInt(sessionStorage.getItem('loading'))) {
            sessionStorage.setItem('loading', '1')
            loadingInterval = setTimeout(() => {
                console.log('loading...')
                let main = document.querySelector('main')
                main.innerHTML = `<div class="d-flex justify-content-center align-items-center gap-2" style="flex: 1;">
                                    <div class="spinner-border text-success" role="status"></div><p class="m-0" style="color:green">Loading...wait some seconds</p>
                                </div>`
            },2000)
        }
    }
}

export function getNavbarOptions(isEdit=false, cancel = false) {
    if(isEdit && (!sessionStorage.getItem('navbarComponent') || sessionStorage.getItem('navbarComponent') === 'navbarOptions')) {
        fetch(BACKEND + `api/pages/navbarEditOptions`)
        .then(response => response.text())
        .then(res => {
            renderOptions(res)
            sessionStorage.setItem('navbarComponent', 'navbarEditOptions')
        })
        if(sessionStorage.getItem('currentPage') != 'htmlEditor' || cancel) {
            changeComponent('welcomeEdit', false, null, isEdit)
            if(cancel) {
                sessionStorage.removeItem('currentCode')
                clearInterval(intervalCurrentCode)
            }
        }
    }
    else {
        fetch(BACKEND + `api/pages/navbarOptions`)
        .then(response => response.text())
        .then(res => {
            renderOptions(res)
            sessionStorage.setItem('navbarComponent', 'navbarOptions')
        })
    }
    

    function renderOptions(res) {
        let navContainer = document.querySelector('ul.navbar-nav')
        navContainer.innerHTML = res
        executeScript(navContainer)
    }
}

export function changeComponent(page, fromEditor=false, pageToEditor=null, isEdit=false) {
    xmlhttp.open('GET', BACKEND + 'api/pages/' + page, true)
    xmlhttp.setRequestHeader('Content-Type', 'text/html');
    xmlhttp.send()

    sessionStorage.setItem('currentPage', page)
    
    if(!isEdit) {
        getNavbarOptions()
    }
    
    if(fromEditor) {
        localStorage.setItem('pageToEditor', pageToEditor)
    }

    const navbarContent = document.getElementById('navbarSupportedContent')
    if (page != 'welcomeEdit' && navbarContent && navbarContent.classList.contains('show')) {
        const navbarToggler = document.querySelector('button.navbar-toggler')
        if (navbarToggler) {
            navbarToggler.click()
        } else {
            console.warn('Navbar toggler button is not found.')
        }
    }

}

export function executeScript(node) {
    const scripts = node.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
        script.parentNode.removeChild(script);
    });
}

export function manageCodeEditor() {
    let editorElement = document.querySelector('#editor');
    if (editorElement) {
        const pageToEditor = localStorage.getItem('pageToEditor');
        if (pageToEditor && !sessionStorage.getItem('currentCode')) {
            fetch(BACKEND + `api/pages/${pageToEditor}`)
            .then(response => response.text())
            .then(data => {
                let editor = ace.edit(editorElement);
                editor.setValue(data, -1);
            })
            .catch(error => {
                console.error('Error fetching editor content:', error);
            });
        }
        else {
            let editor = ace.edit(editorElement);
            editor.setValue(sessionStorage.getItem('currentCode'), -1);
        }
    }
}

// 0 (UNSENT): The XMLHttpRequest object has been created, but the open() method hasn't been called yet.
// 1 (OPENED): The open() method has been called. This is the state right after calling open() but before calling send().
// 2 (HEADERS_RECEIVED): The send() method has been called, and the response headers have been received.
// 3 (LOADING): The response is being downloaded; responseText holds partial data.
// 4 (DONE): The operation is complete. This means the entire response has been received.

