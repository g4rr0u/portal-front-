
document.addEventListener('DOMContentLoaded', function() {
    const createRequestBtn = document.getElementById('createRequestBtn');
    const userRequestsBlock = document.getElementById('userRequestsBlock');
    const login = localStorage.getItem('login');
    const logoutBtn = document.getElementById('logoutBtn');
    const requestForm = document.getElementById('requestForm');
    const user_id = localStorage.getItem('user_id')

    
    fetch(`php/getUserRequests.php?user_id=${user_id}`)
    .then(response => response.json())
    .then(data => {
       
        data.forEach(request => {
            const requestElement = requestCreate(request.request_id, request.name, request.status, request.time, request.category, request.description, request.pathToPhoto);
            userRequestsBlock.appendChild(requestElement);
        });
    })
    .catch(error => {
        console.error('Error fetching user requests:', error);
    });



    fetch('php/getData.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `login=${encodeURIComponent(login)}`
                
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('login', data.login);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('fullName', data.surname + " " + data.name + " " + data.patronimyc)
        } else {
            console.log('invalid data')
        }
        })
        
        function requestCreate(requestId, name, status,  time, category, description, pathToPhoto) {
            
            var requestIdGET = requestId
            var requestElement = document.createElement('div');
            requestElement.classList.add('request');
        
            var requestHeader = document.createElement('div');
            requestHeader.classList.add('requestHeader');
        
            var requestContent = document.createElement('div')
            requestContent.classList.add('requestContent');
        
            var requestFooter = document.createElement('div')
            requestFooter.classList.add('requestFooter');
        
            var requestName = document.createElement('p')
            requestName.textContent = name;
            requestName.classList.add('requestName');

            var requestTimestamp = document.createElement('p')
            requestTimestamp.textContent = time;
            requestTimestamp.classList.add('requestTimestamp');

            var requestStatus = document.createElement('p')
            requestStatus.textContent = status;
            requestStatus.classList.add('requestStatus');
            
            var requestCategory = document.createElement('p')
            requestCategory.textContent =decodeURI(category)  ;
            requestCategory.classList.add('requestCategory');
            
            var requestDescription = document.createElement('p')
            requestDescription.textContent = description;
            requestDescription.classList.add('requestDescription');
            
            var requestPhoto = document.createElement('img');
            requestPhoto.src = pathToPhoto;
            requestPhoto.classList.add('requestPhoto');

            var deleteRequestBtn = document.createElement('button');
            deleteRequestBtn.classList.add('deleteButton');
            deleteRequestBtn.textContent = 'Удалить';
            deleteRequestBtn.addEventListener('click', function () {
                fetch('php/deleteRequest.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `requestId=${encodeURIComponent(requestIdGET)}`,
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            requestElement.remove();
                        } else {
                            console.error('Error deleting request:', data.error);
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting request:', error);
                    });
            });

           if(status == 'Новая'){
            requestFooter.appendChild(deleteRequestBtn);
           }
            requestHeader.appendChild(requestName);
            requestHeader.appendChild(requestStatus);
            requestHeader.appendChild(requestTimestamp);
        
            requestContent.appendChild(requestCategory);
            requestContent.appendChild(requestDescription);
            requestContent.appendChild(requestPhoto);
        
            requestElement.appendChild(requestHeader);
            requestElement.appendChild(requestContent);
            requestElement.appendChild(requestFooter);
        
            if(document.getElementsByClassName('requestStatus').value == 'Новая'){
                document.getElementById('deleteRequestBtn').style.display = 'none'
            }

            return requestElement;
            
            
        }
    
    console.log(document.getElementsByClassName('requestStatus').value)
    if(!login){
        window.location.href = 'login.html';
    } else {
        document.getElementById('fullName').textContent = localStorage.getItem('fullName')
    }

    requestForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const form = document.getElementById('requestForm');
        const fileInput = document.getElementById('fileInput');

        if (fileInput.files.length === 0) {
            return;
        }

        const file = fileInput.files[0];

        const allowedFormats = ['image/jpeg', 'image/png', 'image/bmp'];
        if (!allowedFormats.includes(file.type)) {
            return;
        }

        const maxSizeMB = 10;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (file.size > maxSizeBytes) {
            return;
        }

        const user_id = encodeURIComponent(localStorage.getItem('user_id'));
        const requestName = encodeURIComponent(document.getElementById('requestName').value);
        const requestCategory = encodeURIComponent(document.getElementById('requestCategory').value);
        const requestDescription = encodeURIComponent(document.getElementById('requestDescription').value);


        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('requestName', requestName);
        formData.append('requestCategory', requestCategory);
        formData.append('requestDescription', requestDescription);
        formData.append('fileInput', file);

        fetch('php/uploadRequest.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
    });




    createRequestBtn.addEventListener('click', function() {
        requestForm.style.display = 'block'
    })
    document.getElementById('cancelRequestBtn').addEventListener('click', function() {
        requestForm.style.display = 'none'
    })
   
});


function exit(){
    localStorage.clear();
    window.location.href = "index.html"
}