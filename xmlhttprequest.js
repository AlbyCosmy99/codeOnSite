window.onload = () => {
    getNavbarOptions()
}

xmlhttp = new XMLHttpRequest()
xmlhttp.onreadystatechange = () => {
    if(xmlhttp.readyState===4 && xmlhttp.status === 200) {
        let main = document.querySelector('main')
        main.innerHTML = xmlhttp.responseText
        executeScript(main)

        manageCodeEditor()
    }
}

function getNavbarOptions(isEdit=false) {
    if(isEdit) {
        fetch(`http://localhost:3000/api/pages/navbarEditOptions`)
        .then(response => response.text())
        .then(res => {
            renderOptions(res)
        })
        changeComponent('welcomeEdit', false, null, isEdit)
    }
    else {
        fetch(`http://localhost:3000/api/pages/navbarOptions`)
    .then(response => response.text())
        .then(res => {
            renderOptions(res)
        })
    }

    function renderOptions(res) {
        let navContainer = document.querySelector('ul.navbar-nav')
        navContainer.innerHTML = res
        executeScript(navContainer)
    }
}

function changeComponent(page, fromEditor=false, pageToEditor=null, isEdit=false) {
    xmlhttp.open('GET', 'http://localhost:3000/api/pages/' + page, true)
    xmlhttp.setRequestHeader('Content-Type', 'text/html');
    xmlhttp.send()
    
    if(!isEdit) {
        getNavbarOptions()
    }
    
    if(fromEditor) {
        localStorage.setItem('pageToEditor', pageToEditor)
    }
}

function executeScript(node) {
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

function manageCodeEditor() {
    let editorElement = document.querySelector('#editor');
    if (editorElement) {
        const pageToEditor = localStorage.getItem('pageToEditor');
        if (pageToEditor) {
            fetch(`http://localhost:3000/api/pages/${pageToEditor}`)
                .then(response => response.text())
                .then(data => {
                    let editor = ace.edit(editorElement);
                    editor.setValue(data, -1);
                })
                .catch(error => {
                    console.error('Error fetching editor content:', error);
                });
        }
    }
}

// 0 (UNSENT): The XMLHttpRequest object has been created, but the open() method hasn't been called yet.
// 1 (OPENED): The open() method has been called. This is the state right after calling open() but before calling send().
// 2 (HEADERS_RECEIVED): The send() method has been called, and the response headers have been received.
// 3 (LOADING): The response is being downloaded; responseText holds partial data.
// 4 (DONE): The operation is complete. This means the entire response has been received.

