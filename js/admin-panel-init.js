document.addEventListener('DOMContentLoaded', function () {
    const adminRequestsBlock = document.getElementById('adminRequestsBlock');
    const login = localStorage.getItem('login');

    fetch('php/adminGetAllRequests.php', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(request => {
                const requestElement = adminRequestCreate(request.request_id, request.name, request.status, request.time, request.category, request.description, request.pathToPhoto);
                adminRequestsBlock.appendChild(requestElement);
            });
        })
        .catch(error => {
            console.error('Error fetching admin requests:', error);
        });

    function adminRequestCreate(requestId, name, status, time, category, description, pathToPhoto) {
        var requestIdGET = requestId
        
        console.log(requestIdGET)
        var requestElement = document.createElement('div');
        requestElement.classList.add('request');

        var requestHeader = document.createElement('div');
        requestHeader.classList.add('requestHeader');

        var requestContent = document.createElement('div');
        requestContent.classList.add('requestContent');

        var requestFooter = document.createElement('div');
        requestFooter.classList.add('requestFooter');

        var requestName = document.createElement('p');
        requestName.textContent = name;
        requestName.classList.add('requestName');

        var requestTimestamp = document.createElement('p');
        requestTimestamp.textContent = time;
        requestTimestamp.classList.add('requestTimestamp');

        var requestStatus = document.createElement('p');
        requestStatus.textContent = status;
        requestStatus.classList.add('requestStatus');

        var requestCategory = document.createElement('p');
        requestCategory.textContent = decodeURI(category);
        requestCategory.classList.add('requestCategory');

        var requestDescription = document.createElement('p');
        requestDescription.textContent = description;
        requestDescription.classList.add('requestDescription');

        var requestPhoto = document.createElement('img');
        requestPhoto.src = pathToPhoto;
        requestPhoto.classList.add('requestPhoto');

        var statusDropdown = document.createElement('select');
        statusDropdown.classList.add('statusDropdown');

        var statusOptions = ['Отклонена', 'Новая', 'Решено'];
        statusOptions.forEach(option => {
        var statusOption = document.createElement('option');
        statusOption.value = option;
        statusOption.textContent = option;
        statusDropdown.appendChild(statusOption);
        });
        var changeStatusBtn = document.createElement('button');
        changeStatusBtn.classList.add('changeStatusButton');
        changeStatusBtn.textContent = 'Изменить статус';
        changeStatusBtn.addEventListener('click', function () {
                var newStatus = statusDropdown.value;
                console.log(newStatus, requestId)
                fetch('php/changeStatusRequest.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `requestId=${encodeURIComponent(requestIdGET)}&newStatus=${encodeURIComponent(newStatus)}`,
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status == 200) {
                            requestStatus.textContent = newStatus;
                        } else {
                            console.error('Error changing request status:', data.error);
                        }
                    })
                    .catch(error => {
                        console.error('Error changing request status:', error);
                    });
            });
        
        requestHeader.appendChild(requestName);
        requestFooter.appendChild(statusDropdown);
        requestFooter.appendChild(changeStatusBtn);
        requestHeader.appendChild(requestStatus);
        requestHeader.appendChild(requestTimestamp);


        requestContent.appendChild(requestCategory);
        requestContent.appendChild(requestDescription);
        requestContent.appendChild(requestPhoto);

        requestElement.appendChild(requestHeader);
        requestElement.appendChild(requestContent);
        requestElement.appendChild(requestFooter);

        return requestElement;
    }
    if (!login) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('fullName').textContent = localStorage.getItem('fullName')
    }
});

function exit() {
    localStorage.clear();
    window.location.href = "index.html"
}