xmlhttp = new XMLHttpRequest()
xmlhttp.onreadystatechange = () => {
    if(xmlhttp.readyState===4 && xmlhttp.status === 200) {
        console.log(xmlhttp.responseText)
        let main = document.querySelector('main')
        main.innerHTML = xmlhttp.responseText

        const scripts = main.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript).parentNode.removeChild(newScript);
        });
    }
}

function changeComponent(page) {
    xmlhttp.open('GET', 'http://localhost:3000/api/'+page, true)
    xmlhttp.setRequestHeader('Content-Type', 'text/html');
    xmlhttp.send()
    
}



// 0 (UNSENT): The XMLHttpRequest object has been created, but the open() method hasn't been called yet.
// 1 (OPENED): The open() method has been called. This is the state right after calling open() but before calling send().
// 2 (HEADERS_RECEIVED): The send() method has been called, and the response headers have been received.
// 3 (LOADING): The response is being downloaded; responseText holds partial data.
// 4 (DONE): The operation is complete. This means the entire response has been received.